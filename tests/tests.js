
"use strict";

// deps

	const SimpleTTS = require(require('path').join(__dirname, '..', 'main.js'));

// tests

	function testGetVoices() {

		return new Promise(function(resolve, reject) {

			try {

				console.log("----------------");
				console.log("test get voices");
				console.log("----------------");
				console.log("");

				console.log("must be == <voices> :");
				
				SimpleTTS.getVoices().then(function(voices) {

					console.log(voices);

					console.log("");
					console.log("----------------");

					resolve(voices);

				}).catch(function(err) {

					console.log(err);

					console.log("");
					console.log("----------------");

					reject();

				});

			}
			catch (e) {
				console.log(e);
				reject(e);
			}

		});

	}

	function testRead(voices) {

		return new Promise(function(resolve, reject) {

			try {

				console.log("");
				console.log("");

				console.log("----------------");
				console.log("test read");
				console.log("----------------");
				console.log("");

				console.log("must be == 'Ok with options' :");
				
				SimpleTTS.read({text: "ceci est un test", voice: voices[0], speed: 70, volume: 30}).then(function() {

					console.log('Ok with options');

					console.log("");
					console.log("must be == 'Ok without options' :");

					SimpleTTS.read("ceci est un test").then(function() {

						console.log('Ok without options');
						
						console.log("");
						console.log("----------------");

						resolve();

					}).catch(function(err) {

						console.log(err);
						
						console.log("");
						console.log("----------------");

						reject();

					});
					
				}).catch(function(err) {

					console.log(err);
					
					console.log("");
					console.log("----------------");

					reject();

				});

			}
			catch (e) {
				console.log(e);
				reject(e);
			}

		});

	}

// run

	try {

		console.log("");
		console.log("");
		console.log(SimpleTTS.getTTSSystem());
		console.log("");
		console.log("");

		testGetVoices().then(testRead);

	}
	catch (e) {
		console.log(e);
	}
