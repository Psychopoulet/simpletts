
"use strict";

// dépendances
	
	const 	path = require('path'),
			exec = require('child_process').exec;

// private

	// attributes

		var _isWindows = (-1 < require('os').type().toLowerCase().indexOf('windows')),
			_cscriptPath = 'cscript //NoLogo',
			_espeakPath = 'espeak',
			_batchsPath = path.join(__dirname, 'batchs');
		
// module

	module.exports = class SimpleTTS {

		static getVoices() {
			
			return new Promise(function(resolve, reject) {

				try {

					if (_isWindows) {

						exec(_cscriptPath + ' "' + path.join(_batchsPath, 'listvoices.vbs') + '"', function (err, stdout, stderr) {

							if (err) {
								reject(stderr);
							}
							else {

								stdout = stdout.trim().replace(/\r/g, "\n").replace(/\n\n/g, "\n").split("\n");

								let headers = stdout[0].split(';'),
									voices = stdout.slice(1, stdout.length);

								for (let i = 0; i < voices.length; ++i) {

									let voice = voices[i].split(';');
									voices[i] = {};

									for (let j = 0; j < headers.length; ++j) {
										voices[i][headers[j]] = voice[j].trim();
									}

								}

								resolve(voices);

							}

						});

					}
					else {

						exec(_espeakPath + ' --voices', function (err, stdout, stderr) {

							if (err) {
								reject(stderr);
							}
							else {

								stdout = stdout.trim().replace(/\r/g, "\n").replace(/\n\n/g, "\n").split("\n");

								let headers = stdout[0].split(';'),
									voices = stdout.slice(1, stdout.length);

								resolve(voices);

							}

						});

					}

				}
				catch(e) {
					reject(e);
				}

			});

		}

		static read(text) {
			
			return new Promise(function(resolve, reject) {

				try {

					let cmd = (_isWindows) ? path.join(_batchsPath, 'ptts.vbs') + ' -t "' + text + '"' : _espeakPath + ' -v fr+f5 -k 5 -s 150 -a 10 "' + text + '"';

					exec(cmd, function (err, stdout, stderr) {
						
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
