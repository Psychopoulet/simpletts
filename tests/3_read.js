
"use strict";

// deps

	const assert = require("assert");
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
		return tts.read("test");
	}).timeout(MAX_TIMEOUT);

	it("should play a text with options", () => {

		return tts.getVoices().then((voices) => {

			voice = voices.shift();

			return tts.read({
				"voice": voices[0],
				"volume": 30,
				"speed": 70,
				"text": "test"
			});

		});

	}).timeout(MAX_TIMEOUT);

	it("should play a text with voice name option", () => {

		return tts.read({
			"voice": voice.name,
			"text": "test"
		});

	}).timeout(MAX_TIMEOUT);

	it("should play a text with too low volume & speed", () => {

		return tts.read({
			"volume": -20,
			"speed": -20,
			"text": "test"
		});

	}).timeout(MAX_TIMEOUT);

	it("should play a text with too high volume & speed", () => {

		return tts.read({
			"volume": 120,
			"speed": 120,
			"text": "test"
		});

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
