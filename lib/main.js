
"use strict";

// deps
	
	const path = require("path");
	const exec = require("child_process").exec;

// consts

	const IS_WINDOWS = ("win32" === require("os").platform().trim().toLowerCase());
	const CSCRIPT = "cscript //NoLogo //B";

	const LISTVOICES = path.join(__dirname, "..", "batchs", "listvoices.vbs");
	const PLAYTEXT = path.join(__dirname, "..", "batchs", "playtext.vbs");

// private

	// attrs

		var _defaultVoice = null;

// module

	class SimpleTTS {

		static setDefaultVoice(defaultVoice) {
			_defaultVoice = defaultVoice;
		}

		static getTTSSystem() {
			return (IS_WINDOWS) ? "sapi" : "espeak";
		}

		static getVoices() {
			
			return new Promise((resolve, reject) => {

				exec((IS_WINDOWS) ?
					CSCRIPT + " \"" + LISTVOICES + "\"" :
					"espeak --voices", (err, stdout, stderr) => {

					if (err) {
						reject(stderr);
					}
					else {

						stdout = stdout.trim().replace(/\r/g, "\n").replace(/\n\n/g, "\n").split("\n");

						let voices = stdout.slice(1, stdout.length);

							if (IS_WINDOWS) {

								let headers = stdout[0].split(";");

								for (let i = 0; i < voices.length; ++i) {

									let voice = voices[i].split(";");
									voices[i] = {};

									for (let j = 0; j < headers.length; ++j) {
										voices[i][headers[j]] = voice[j].trim();
									}

								}

							}
							else {

								for (let i = 0; i < voices.length; ++i) {

									let voice = voices[i].trim(); voice = voice.slice(1, voice.length).trim();
									voices[i] = {};

									voices[i].Language = voice.slice(0, 15).trim();
									voice = voice.slice(15, voice.length);

									voices[i]["Age/Gender"] = voice.slice(0, 3).trim();
									voice = voice.slice(3, voice.length);

									voices[i].VoiceName = voice.slice(0, 21).trim();
									voice = voice.slice(21, voice.length);

									voices[i].File = voice.slice(0, 14).trim();
									voice = voice.slice(14, voice.length).trim();

									voices[i].Others = [];
									if (0 < voice.length) {

										let others = voice.split("(");

										for (let j = 0; j < others.length; ++j) {

											if ("" != others[j]) {
												voices[i].Others.push(others[j].slice(0, others[j].length - 1));
											}
											
										}

									}

								}

							}

						resolve(voices);

					}

				});

			// standardise
			}).then((voices) => {

				let result = [];

					voices.forEach((voice) => {

						if (IS_WINDOWS) {

							result.push({
								gender: voice.Gender.trim().toLowerCase(),
								name: voice.Name.trim().toLowerCase()
							});

						}
						else {

							result.push({
								gender: ("F" === voice["Age/Gender"]) ? "female" : "male",
								name: voice.VoiceName.trim().toLowerCase()
							});

						}

					});

				return Promise.resolve(result);

			});

		}

		static read(options) {
			
			if ("undefined" === typeof options) {
				return Promise.reject(new Error("Missing options"));
			}
			else {

				options = ("string" === typeof options) ? { text: options } : options;

				if ("object" !== typeof options) {
					return Promise.reject(new Error("Invalid options"));
				}
				else if ("string" !== typeof options.text) {
					return Promise.reject(new Error((("undefined" === typeof options.text) ? "Missing" : "Invalid") + " text"));
				}
				else {

					return Promise.resolve().then(() => {

						if (_defaultVoice) {
							return Promise.resolve(_defaultVoice);
						}
						else {

							return SimpleTTS.getVoices().then((voices) => {

								_defaultVoice = voices[0];
								return Promise.resolve(_defaultVoice);

							});

						}

					}).then((defaultVoice) => {

						let args = [];

						if ("object" !== typeof options.voice && "string" !== typeof options.voice) {
							options.voice = defaultVoice;
						}

						options.volume = ("undefined" === typeof options.volume) ? 100 : Math.round(options.volume);
							options.volume = (0 > options.volume) ? 0 : options.volume;
							options.volume = (100 < options.volume) ? 100 : options.volume;

						options.speed = ("undefined" === typeof options.speed) ? 50 : Math.round(options.speed);
							options.speed = (0 > options.speed) ? 0 : options.speed;
							options.speed = (100 < options.speed) ? 100 : options.speed;

						if (IS_WINDOWS) {
							args.push("-v", options.volume); // 0 -> 100
							args.push("-r", Math.round((options.speed / 5)) - 10); // -10 -> 10
							args.push("-voice", ("string" === typeof options.voice) ? "\"" + options.voice + "\"" : "\"" + options.voice.name + "\"");
						}
						else {
							args.push("-a", options.volume * 2); // 0 -> 200
							args.push("-s", Math.round((options.speed / 50 * 80) + 80)); // 80 -> 240
							args.push("-v", ("string" === typeof options.voice) ? "\"" + options.voice + "\"" : "\"" + options.voice.name + "\"");
						}

						args.push("\"" + options.text + "\"");

						return Promise.resolve(args);

					}).then((args) => {

						return new Promise((resolve, reject) => {

							exec((IS_WINDOWS) ?
								CSCRIPT + " \"" + PLAYTEXT + "\" " + args.join(" ") :
								"espeak " + args.join(" "), (err, stdout, stderr) => {

								if (err) {
									reject(stderr);
								}
								else {
									resolve();
								}

							});

						});

					});

				}

			}

		}

	}

	module.exports = SimpleTTS;
