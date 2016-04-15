
"use strict";

// dépendances
	
	const 	path = require('path'),
			exec = require('child_process').exec;

// private

	// attributes

		var _isWindows = (-1 < require('os').type().toLowerCase().indexOf('windows')),
			_cscriptPath = 'cscript //NoLogo //B',
			_espeakPath = 'espeak',
			_batchsPath = path.join(__dirname, 'batchs');
		
// module

	module.exports = class SimpleTTS {

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
					reject(e);
				}

			});

		}

		static read(options) {
			
			return new Promise(function(resolve, reject) {

				try {

					options = ('string' === typeof options) ? { text: options } : options;

					exec((_isWindows) ?
						_cscriptPath + ' "' + path.join(_batchsPath, 'playtext.vbs') + '"'  + ' "' + options.text + '"' :
						_espeakPath + ' -v fr+f5 -k 5 -s 150 -a 10 "' + options.text + '"', function (err, stdout, stderr) {

						if (err) {
							reject(stderr);
						}
						else {
							resolve();
						}

					});

				}
				catch(e) {
					reject(e);
				}

			});

		}

	};