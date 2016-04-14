
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

				console.log("must be == <voices> :");
				
				SimpleTTS.getVoices().then(function(voices) {

					console.log(voices);
					console.log("----------------");

					resolve();

				}).catch(function(err) {

					console.log(err);
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

		testGetVoices().then(function() {

			return;

			console.log("");
			console.log("");

			console.log("----------------");
			console.log("test read");
			console.log("----------------");

			console.log("must be == 'Ok' :");
				
			SimpleTTS.read("ceci est un test").then(function() {

				console.log('Ok');
				console.log("----------------");

			}).catch(function(err) {
				console.log(err);
				console.log("----------------");
			});

		});

	}
	catch (e) {
		console.log(e);
	}
