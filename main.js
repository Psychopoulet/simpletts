
"use strict";

// dépendances
	
	const 	path = require('path'),
			exec = require('child_process').exec;

// private

	// attributes

		var _isWindows = (-1 < require('os').type().toLowerCase().indexOf('windows')),
			_defaultVoice = null,
			_cscriptPath = 'cscript //NoLogo //B',
			_espeakPath = 'espeak',
			_batchsPath = path.join(__dirname, 'batchs');

	// function

		function _guessDefaultVoice() {

			return new Promise(function(resolve, reject) {

				try {

					if (_defaultVoice) {
						resolve();
					}
					else {

						SimpleTTS.getVoices().then(function(voices) {

							_defaultVoice = voices[0];
							resolve();

						}).catch(reject);

					}

				}
				catch(e) {
					reject((e.message) ? e.message : e);
				}

			});

		}

// module

	class SimpleTTS {

		static setDefaultVoice(defaultVoice) {
			_defaultVoice = defaultVoice;
		}

		static getTTSSystem() {
			return (_isWindows) ? 'SAPI' : 'espeak';
		}

		static getVoices() {
			
			return new Promise(function(resolve, reject) {

				try {

					exec((_isWindows) ?
						_cscriptPath + ' "' + path.join(_batchsPath, 'listvoices.vbs') + '"' :
						_espeakPath + ' --voices', function (err, stdout, stderr) {

						if (err) {
							reject(stderr);
						}
						else {

							stdout = stdout.trim().replace(/\r/g, "\n").replace(/\n\n/g, "\n").split("\n");

							let voices = stdout.slice(1, stdout.length);

								if (_isWindows) {

									let headers = stdout[0].split(';');

									for (let i = 0; i < voices.length; ++i) {

										let voice = voices[i].split(';');
										voices[i] = {};

										for (let j = 0; j < headers.length; ++j) {
											voices[i][headers[j]] = voice[j].trim();
										}

									}

								}
								else {

									let headers = ['Language', 'Age/Gender', 'VoiceName', 'File', 'Others'];

									for (let i = 0; i < voices.length; ++i) {

										let voice = voices[i].trim(); voice = voice.slice(1, voice.length).trim();
										voices[i] = {};

										voices[i].Language = voice.slice(0, 15).trim();
										voice = voice.slice(15, voice.length);

										voices[i]['Age/Gender'] = voice.slice(0, 3).trim();
										voice = voice.slice(3, voice.length);

										voices[i].VoiceName = voice.slice(0, 21).trim();
										voice = voice.slice(21, voice.length);

										voices[i].File = voice.slice(0, 14).trim();
										voice = voice.slice(14, voice.length).trim();

										voices[i].Others = []
										if (0 < voice.length) {

											let others = voice.split('(');

											for (let j = 0; j < others.length; ++j) {

												if ('' != others[j]) {
													voices[i].Others.push(others[j].slice(0, others[j].length - 1));
												}
												

											}

										}

									}

								}

							resolve(voices);

						}

					});

				}
				catch(e) {
					reject((e.message) ? e.message : e);
				}

			});

		}

		static read(options) {
			
			return new Promise(function(resolve, reject) {

				try {

					if ('undefined' === typeof options) {
						reject('Missing options');
					}
					else {

						options = ('string' === typeof options) ? { text: options } : options;

						if ('object' !== typeof options) {
							reject('Invalid options');
						}
						else if ('string' !== typeof options.text) {
							reject((('undefined' === typeof options.text) ? 'Missing' : 'Invalid') + ' text');
						}
						else {

							_guessDefaultVoice().then(function() {

								let args = [];

								if ('object' !== typeof options.voice && 'string' !== typeof options.voice) {
									options.voice = _defaultVoice;
								}

								options.volume = ('undefined' === typeof options.volume) ? 100 : Math.round(options.volume);
									options.volume = (0 > options.volume) ? 0 : options.volume;
									options.volume = (100 < options.volume) ? 100 : options.volume;

								options.speed = ('undefined' === typeof options.speed) ? 50 : Math.round(options.speed);
									options.speed = (0 > options.speed) ? 0 : options.speed;
									options.speed = (100 < options.speed) ? 100 : options.speed;

								if (_isWindows) {
									args.push('-v', options.volume); // 0 -> 100
									args.push('-r', Math.round((options.speed / 5)) - 10); // -10 -> 10
									args.push('-voice', ('string' === typeof options.voice) ? '"' + options.voice + '"' : '"' + options.voice.Name + '"');
								}
								else {
									args.push('-a', options.volume * 2); // 0 -> 200
									args.push('-s', Math.round((options.speed / 50 * 80) + 80)); // 80 -> 240
									args.push('-v', ('string' === typeof options.voice) ? '"' + options.voice + '"' : '"' + options.voice.VoiceName + '"');
								}

								args.push('"' + options.text + '"');

								exec((_isWindows) ?
									_cscriptPath + ' "' + path.join(_batchsPath, 'playtext.vbs') + '" ' + args.join(' ') :
									_espeakPath + ' ' + args.join(' '), function (err, stdout, stderr) {

									if (err) {
										reject(stderr);
									}
									else {
										resolve();
									}

								});

							}).catch(reject);

						}

					}

				}
				catch(e) {
					reject((e.message) ? e.message : e);
				}

			});

		}

	}

	module.exports = SimpleTTS;
