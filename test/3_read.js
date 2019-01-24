
"use strict";

// deps

	// natives
	const assert = require("assert");

	// locals
	const SimpleTTS = require(require("path").join(__dirname, "..", "lib", "main.js"));

// consts

	const IS_WINDOWS = "win32" === require("os").platform().trim().toLowerCase();
	const MAX_TIMEOUT = 10000;

// tests

describe("read", () => {

	const tts = new SimpleTTS();

	let voice = null;

	it("should test missing options", (done) => {

		tts.read().then(() => {
			done(new Error("Does not generate an error"));
		}).catch((err) => {

			assert.strictEqual(typeof err, "object", "This is not an object");
			assert.strictEqual(err instanceof ReferenceError, true, "This is not a valid error");

			done();

		});

	});

	it("should test wrong options", (done) => {

		tts.read(false).then(() => {
			done(new Error("Does not generate an error"));
		}).catch((err) => {

			assert.strictEqual(typeof err, "object", "This is not an object");
			assert.strictEqual(err instanceof TypeError, true, "This is not a valid error");

			done();

		});

	});

	it("should test missing text", (done) => {

		tts.read({ "test": "test" }).then(() => {
			done(new Error("Does not generate an error"));
		}).catch((err) => {

			assert.strictEqual(typeof err, "object", "This is not an object");
			assert.strictEqual(err instanceof ReferenceError, true, "This is not a valid error");

			done();

		});

	});

	it("should test wrong text", (done) => {

		tts.read({ "text": false }).then(() => {
			done(new Error("Does not generate an error"));
		}).catch((err) => {

			assert.strictEqual(typeof err, "object", "This is not an object");
			assert.strictEqual(err instanceof TypeError, true, "This is not a valid error");

			done();

		});

	});

	it("should test empty text", (done) => {

		tts.read({ "text": "" }).then(() => {
			done(new Error("Does not generate an error"));
		}).catch((err) => {

			assert.strictEqual(typeof err, "object", "This is not an object");
			assert.strictEqual(err instanceof Error, true, "This is not a valid error");

			done();

		});

	});

	it("should set default voice", () => {
		tts.defaultVoice = null;
	});

	it("should play a text without options", () => {

		return tts.read("test").then((options) => {

			assert.strictEqual(typeof options, "object", "This is not an object");
			assert.strictEqual(typeof options.text, "string", "This is not a valid option");
				assert.strictEqual(options.text, "test", "This is not the wanted option");
			assert.strictEqual(typeof options.voice, "object", "This is not a valid option");
				assert.strictEqual(typeof options.voice.gender, "string", "This is not a valid option");
				assert.strictEqual(typeof options.voice.name, "string", "This is not a valid option");
			assert.strictEqual(typeof options.volume, "number", "This is not a valid option");
				assert.strictEqual(options.volume, 100, "This is not the wanted option");
			assert.strictEqual(typeof options.speed, "number", "This is not a valid option");
				assert.strictEqual(options.speed, 50, "This is not the wanted option");

			return Promise.resolve();

		});

	}).timeout(MAX_TIMEOUT);

	it("should play a text with options", () => {

		return tts.getVoices().then((voices) => {

			voice = voices.shift();

			return tts.read({
				voice,
				"volume": 30,
				"speed": 70,
				"text": "test"
			}).then((options) => {

				assert.strictEqual(typeof options, "object", "This is not an object");
				assert.strictEqual(typeof options.text, "string", "This is not a valid option");
					assert.strictEqual(options.text, "test", "This is not the wanted option");
				assert.strictEqual(typeof options.voice, "object", "This is not a valid option");
					assert.strictEqual(typeof options.voice.gender, "string", "This is not a valid option");
						assert.strictEqual(options.voice.gender, voice.gender, "This is not the wanted option");
					assert.strictEqual(typeof options.voice.name, "string", "This is not a valid option");
						assert.strictEqual(options.voice.name, voice.name, "This is not the wanted option");
				assert.strictEqual(typeof options.volume, "number", "This is not a valid option");
					assert.strictEqual(options.volume, 30, "This is not the wanted option");
				assert.strictEqual(typeof options.speed, "number", "This is not a valid option");
					assert.strictEqual(options.speed, 70, "This is not the wanted option");

				return Promise.resolve();

			});

		});

	}).timeout(MAX_TIMEOUT);

	it("should play a text with voice name option", () => {

		return tts.read({
			"voice": voice.name,
			"text": "test"
		}).then((options) => {

			assert.strictEqual(typeof options, "object", "This is not an object");
			assert.strictEqual(typeof options.text, "string", "This is not a valid option");
				assert.strictEqual(options.text, "test", "This is not the wanted option");
			assert.strictEqual(typeof options.voice, "string", "This is not a valid option");
				assert.strictEqual(options.voice, voice.name, "This is not the wanted option");
			assert.strictEqual(typeof options.volume, "number", "This is not a valid option");
				assert.strictEqual(options.volume, 100, "This is not the wanted option");
			assert.strictEqual(typeof options.speed, "number", "This is not a valid option");
				assert.strictEqual(options.speed, 50, "This is not the wanted option");

			return Promise.resolve();

		});

	}).timeout(MAX_TIMEOUT);

	it("should play a text with too low volume & speed", () => {

		return tts.read({
			"volume": -20,
			"speed": -20,
			"text": "test"
		}).then((options) => {

			assert.strictEqual(typeof options, "object", "This is not an object");
			assert.strictEqual(typeof options.text, "string", "This is not a valid option");
				assert.strictEqual(options.text, "test", "This is not the wanted option");
			assert.strictEqual(typeof options.voice, "object", "This is not a valid option");
				assert.strictEqual(typeof options.voice.gender, "string", "This is not a valid option");
					assert.strictEqual(options.voice.gender, voice.gender, "This is not the wanted option");
				assert.strictEqual(typeof options.voice.name, "string", "This is not a valid option");
					assert.strictEqual(options.voice.name, voice.name, "This is not the wanted option");
			assert.strictEqual(typeof options.volume, "number", "This is not a valid option");
				assert.strictEqual(options.volume, 0, "This is not the wanted option");
			assert.strictEqual(typeof options.speed, "number", "This is not a valid option");
				assert.strictEqual(options.speed, 0, "This is not the wanted option");

			return Promise.resolve();

		});

	}).timeout(MAX_TIMEOUT);

	it("should play a text with too high volume & speed", () => {

		return tts.read({
			"volume": 120,
			"speed": 120,
			"text": "test"
		}).then((options) => {

			assert.strictEqual(typeof options, "object", "This is not an object");
			assert.strictEqual(typeof options.text, "string", "This is not a valid option");
				assert.strictEqual(options.text, "test", "This is not the wanted option");
			assert.strictEqual(typeof options.voice, "object", "This is not a valid option");
				assert.strictEqual(typeof options.voice.gender, "string", "This is not a valid option");
					assert.strictEqual(options.voice.gender, voice.gender, "This is not the wanted option");
				assert.strictEqual(typeof options.voice.name, "string", "This is not a valid option");
					assert.strictEqual(options.voice.name, voice.name, "This is not the wanted option");
			assert.strictEqual(typeof options.volume, "number", "This is not a valid option");
				assert.strictEqual(options.volume, 100, "This is not the wanted option");
			assert.strictEqual(typeof options.speed, "number", "This is not a valid option");
				assert.strictEqual(options.speed, 100, "This is not the wanted option");

			return Promise.resolve();

		});

	}).timeout(MAX_TIMEOUT);

	it("should play multiple reads", (done) => {

		let timeout = null;
		let error = false;

		tts.read("this is a test running").then(() => {

			if (timeout) {
				clearTimeout(timeout);
				timeout = null;
			}

			if (!error) {
				done();
			}

		}).catch(done);

		timeout = setTimeout(() => {

			tts.read("test").then(() => {
				error = true;
				done(new Error("Does not generate an error"));
			}).catch((err) => {

				assert.strictEqual(typeof err, "object", "This is not an object");
				assert.strictEqual(err instanceof Error, true, "This is not a valid error");

			}).catch(() => {
				error = true;
			});

		}, 200);

	}).timeout(MAX_TIMEOUT);

	if (IS_WINDOWS) {

		it("should test force espeak", () => {

			tts.forceEspeak = true;
			tts.defaultVoice = null;

			return tts.getVoices().then((voices) => {

				voice = voices.shift();

				return tts.read({
					"volume": 120,
					"speed": 120,
					"text": "test"
				});

			});

		});

		it("should play a text with voice name option", () => {

			return tts.read({
				"voice": voice.name,
				"text": "test"
			}).catch((err) => {
				(0, console).log(err); return Promise.reject(err);
			});

		}).timeout(MAX_TIMEOUT);

	}

});
