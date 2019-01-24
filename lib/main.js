
"use strict";

// deps

	// natives
	const { exec, spawn } = require("child_process");
	const { join } = require("path");

	// locals
	const parseVoicesEspeak = require(join(__dirname, "parseVoicesEspeak.js"));
	const parseVoicesSAPI = require(join(__dirname, "parseVoicesSAPI.js"));
	const readOptionsToEspeakArgs = require(join(__dirname, "readOptionsToEspeakArgs.js"));
	const readOptionsToSAPIArgs = require(join(__dirname, "readOptionsToSAPIArgs.js"));

// consts

	const IS_WINDOWS = "win32" === require("os").platform().trim().toLowerCase();
	const CSCRIPT_ARGS = [ "//NoLogo", "//B" ];

	const LISTVOICES = join(__dirname, "..", "batchs", "listvoices.vbs");
	const PLAYTEXT = join(__dirname, "..", "batchs", "playtext.vbs");

// module

module.exports = class {

	constructor () {

		this._forceStop = false;
		this._readPromise = null;
		this._reader = null;

		this.defaultVoice = null;
		this.forceEspeak = false;

	}

	getTTSSystem () {
		return IS_WINDOWS && !this.forceEspeak ? "sapi" : "espeak";
	}

	getVoices () {

		const IS_SAPI = "sapi" === this.getTTSSystem();

		return new Promise((resolve, reject) => {

			exec(IS_SAPI ?
				"cscript " + CSCRIPT_ARGS.join(" ") + " \"" + LISTVOICES + "\"" :
				"espeak --voices",
			(err, _stdout, stderr) => {

				if (err) {
					reject(stderr);
				}
				else {

					const stdout = _stdout.trim().replace(/\r/g, "\n").replace(/\n\n/g, "\n").split("\n");

					resolve(
						IS_SAPI ?
							parseVoicesSAPI(stdout.slice(1, stdout.length), stdout) :
							parseVoicesEspeak(stdout.slice(1, stdout.length))
					);

				}

			});

		// standardise
		}).then((voices) => {

			const result = [];

				voices.forEach((_voice) => {

					const voice = {
						"gender": IS_SAPI ? _voice.Gender.trim().toLowerCase() : "",
						"name": IS_SAPI ? _voice.Name.trim().toLowerCase() : _voice.VoiceName.trim().toLowerCase()
					};

					if (!IS_SAPI) {
						voice.gender = "F" === _voice["Age/Gender"] ? "female" : "male";
					}

					result.push(voice);

				});

			return Promise.resolve(result);

		});

	}

	read (_options) {

		this._forceStop = false;

		if ("undefined" === typeof _options) {
			return Promise.reject(new ReferenceError("Missing options parameter"));
		}
			else if ("object" !== typeof _options && "string" !== typeof _options) {
				return Promise.reject(new TypeError("options parameter is not an object or a string"));
			}

		else {

			const options = "string" === typeof _options ? { "text": _options } : _options;

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

				const IS_SAPI = "sapi" === this.getTTSSystem();

				this._readPromise = Promise.resolve().then(() => {

					return this.defaultVoice ? Promise.resolve(this.defaultVoice) : this.getVoices().then((voices) => {
						this.defaultVoice = voices.shift(); return Promise.resolve();
					});

				}).then(() => {

					if ("object" !== typeof options.voice && "string" !== typeof options.voice) {
						options.voice = this.defaultVoice;
					}

					options.volume = "undefined" === typeof options.volume ? 100 : Math.round(options.volume);
						options.volume = 0 > options.volume ? 0 : options.volume;
						options.volume = 100 < options.volume ? 100 : options.volume;

					options.speed = "undefined" === typeof options.speed ? 50 : Math.round(options.speed);
						options.speed = 0 > options.speed ? 0 : options.speed;
						options.speed = 100 < options.speed ? 100 : options.speed;

					return this._forceStop ? Promise.resolve(options) : Promise.resolve().then(() => {

						const args = IS_SAPI ?
							readOptionsToSAPIArgs(options) :
							readOptionsToEspeakArgs(options);

						args.push(options.text);

						return Promise.resolve(args);

					}).then((args) => {

						return new Promise((resolve, reject) => {

							this._reader = IS_SAPI ?
								spawn("cscript", CSCRIPT_ARGS.concat([ PLAYTEXT ]).concat(args)) :
								spawn("espeak", args);

							let err = "";
							this._reader.stderr.on("data", (data) => {
								err += "string" === typeof data ? data : data.toString("ascii");
							});

							this._reader.on("close", (code) => {
								return code ? reject(new Error(err)) : resolve(options);
							});

						});

					});

				}).then((data) => {

					this._forceStop = false;
					this._reader = null;

					return Promise.resolve(data);

				}).catch((err) => {

					this._forceStop = false;
					this._reader = null;

					return Promise.reject(err);

				});

				return this._readPromise;

			}

		}

	}

	stopReading () {

		return new Promise((resolve) => {

			if (this._reader) {
				this._reader.kill();
				this._reader = null;
			}
			else {
				this._forceStop = true;
			}

			resolve();

		}).then(() => {

			return new Promise((resolve, reject) => {

				return this._readPromise ? this._readPromise.then(() => {
					resolve();
				}).catch(reject) : resolve();

			});

		});

	}

	isReading () {
		return null !== this._reader;
	}

};
