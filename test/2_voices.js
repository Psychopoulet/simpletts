
"use strict";

// deps

	// natives
	const assert = require("assert");

	// locals
	const SimpleTTS = require(require("path").join(__dirname, "..", "lib", "main.js"));

// consts

	const IS_WINDOWS = "win32" === require("os").platform().trim().toLowerCase();

// tests

describe("get voices", () => {

	const tts = new SimpleTTS();

	it("should return a voices array", () => {

		return tts.getVoices().then((voices) => {

			assert.strictEqual(typeof voices, "object", "voices are not returned as an array");
			assert.strictEqual(voices instanceof Array, true, "voices are not returned as an array");

			return Promise.resolve();

		});

	});

	if (IS_WINDOWS) {

		it("should test force espeak", () => {

			tts.forceEspeak = true;

			return tts.getVoices();

		});

	}

});
