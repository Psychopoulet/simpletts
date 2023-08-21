
"use strict";

// deps

	// natives
	import { join } from "node:path";
	import { platform } from "node:os";
	import { exec, spawn } from "node:child_process";

	// locals
	import parseVoicesEspeak, { iESpeakVoice } from "./parseVoicesEspeak";
	import parseVoicesSAPI, { iSAPIVoice } from "./parseVoicesSAPI";
	import readOptionsToEspeakArgs from "./readOptionsToEspeakArgs";
	import readOptionsToSAPIArgs from "./readOptionsToSAPIArgs";

// types & interfaces

	// natives
	import { ChildProcess } from "node:child_process";

	// locals

	export interface iVoice {
		name: string;
		gender: "female" | "male";
	};

	export interface iOptions {
		text: string;
		volume?: number;
		speed?: number;
		voice?: iVoice | string;
	};

// consts

	const IS_WINDOWS: boolean = "win32" === platform().trim().toLowerCase();
	const CSCRIPT_ARGS: Array<string> = [ "//NoLogo", "//B" ];

// module

export default class SimpleTTS {

	// attributes

		// private

		private _forceStop: boolean;
		private _readPromise: Promise<iOptions> | null;
		private _reader: ChildProcess | null;
		private _scriptsDirectory: string;

		// public

		public defaultVoice: iVoice | null;
		public forceEspeak: boolean;

	// constructor

	public constructor (scriptsFolderPath: string = join(__dirname, "..", "..", "batchs")) {

		this._forceStop = false;
		this._readPromise = null;
		this._reader = null;
		this._scriptsDirectory = scriptsFolderPath;

		this.defaultVoice = null;
		this.forceEspeak = false;

	}

	public getTTSSystem (): "sapi" | "espeak" {
		return IS_WINDOWS && !this.forceEspeak ? "sapi" : "espeak";
	}

	public getVoices (): Promise<Array<iVoice>> {

		const IS_SAPI: boolean = "sapi" === this.getTTSSystem();

		return new Promise((resolve: (voices: Array<iVoice>) => void, reject: (err: Error) => void): void => {

			exec(IS_SAPI ?
				"cscript " + CSCRIPT_ARGS.join(" ") + " \"" + join(this._scriptsDirectory, "listvoices.vbs") + "\"" :
				"espeak --voices",
			(err: Error | null, _stdout: string, stderr: string): void => {

				if (err) {
					reject(stderr ? new Error(stderr): err);
				}
				else {

					const stdout: Array<string> = _stdout.trim().replace(/\r/g, "\n").replace(/\n\n/g, "\n").split("\n");

					if (IS_SAPI) {

						resolve(parseVoicesSAPI(stdout.slice(1, stdout.length), stdout).map((voice: iSAPIVoice): iVoice => {

							return {
								"gender": voice.Gender.trim().toLowerCase() as "female" | "male",
								"name": voice.Name.trim().toLowerCase()
							};

						}));

					}
					else {

						resolve(parseVoicesEspeak(stdout.slice(1, stdout.length)).map((voice: iESpeakVoice): iVoice => {

							return {
								"gender": "F" === voice["Age/Gender"] ? "female" : "male",
								"name": voice.VoiceName.trim().toLowerCase()
							};

						}));

					}

				}

			});

		});

	}

	public isReading (): boolean {
		return null !== this._reader;
	}

	public read(_options: iOptions | string): Promise<iOptions> {

		this._forceStop = false;

		if ("undefined" === typeof _options) {
			return Promise.reject(new ReferenceError("Missing options parameter"));
		}
			else if ("object" !== typeof _options && "string" !== typeof _options) {
				return Promise.reject(new TypeError("options parameter is not an object or a string"));
			}

		else {

			const options: iOptions = "string" === typeof _options ? { "text": _options } : _options;

			if ("undefined" === typeof options.text) {
				return Promise.reject(new ReferenceError("Missing text parameter"));
			}
				else if ("string" !== typeof options.text) {
					return Promise.reject(new TypeError("text parameter is not a string"));
				}
				else if ("" === options.text.trim()) {
					return Promise.reject(new Error("text parameter is empty"));
				}

			else if (this.isReading()) {
				return Promise.reject(new Error("Already reading a text"));
			}

			else {

				const IS_SAPI: boolean = "sapi" === this.getTTSSystem();

				this._readPromise = Promise.resolve().then((): Promise<void> | void => {

					if (this.defaultVoice) {
						return;
					}
					else {

						return this.getVoices().then((voices: Array<iVoice>): void => {
							this.defaultVoice = voices.length ? voices[0] : null;
						});

					}

				}).then((): Promise<iOptions> | iOptions => {

					if ("object" !== typeof options.voice && "string" !== typeof options.voice) {
						options.voice = this.defaultVoice as iVoice;
					}

					options.volume = "undefined" === typeof options.volume ? 100 : Math.round(options.volume);
						options.volume = 0 > options.volume ? 0 : options.volume;
						options.volume = 100 < options.volume ? 100 : options.volume;

					options.speed = "undefined" === typeof options.speed ? 50 : Math.round(options.speed);
						options.speed = 0 > options.speed ? 0 : options.speed;
						options.speed = 100 < options.speed ? 100 : options.speed;

					return this._forceStop ? options : Promise.resolve().then((): Array<string> => {

						const args: Array<string> = IS_SAPI ?
							readOptionsToSAPIArgs(options) :
							readOptionsToEspeakArgs(options);

						args.push(options.text);

						return args;

					}).then((args: Array<string>) => {

						return new Promise((resolve: (opts: iOptions) => void, reject: (err: Error) => void): void => {

							this._reader = IS_SAPI ?
								spawn("cscript", CSCRIPT_ARGS.concat([ join(this._scriptsDirectory, "playtext.vbs") ]).concat(args)) :
								spawn("espeak", args);

							let err: string = "";

							if (this._reader.stderr) {

								this._reader.stderr.on("data", (data): void => {
									err += "string" === typeof data ? data : data.toString("ascii");
								});

							}

							this._reader.on("close", (code: number): void => {
								return code ? reject(new Error(err)) : resolve(options);
							});

						});

					});

				}).then((data: iOptions): iOptions => {

					this._forceStop = false;
					this._reader = null;

					return data;

				}).catch((err: Error) => {

					this._forceStop = false;
					this._reader = null;

					return Promise.reject(err);

				});

				return this._readPromise;

			}

		}

	}

	public stopReading(): Promise<void> {

		if (this._reader) {

			try {

				this._reader.kill();
				this._reader = null;

			}
			catch (e) {
				return Promise.reject(e);
			}

		}
		else {
			this._forceStop = true;
		}

		return this._readPromise ? this._readPromise.then(() => {
			return Promise.resolve();
		}) : Promise.resolve();

	}

};
