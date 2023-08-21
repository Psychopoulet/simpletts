
"use strict";

// deps

	// natives
	const { strictEqual } = require("node:assert");
	const { join } = require("node:path");
	const { platform } = require("node:os");

	// locals
	const SimpleTTS = require(join(__dirname, "..", "lib", "cjs", "main.cjs"));

// consts

	const IS_WINDOWS = "win32" === platform().trim().toLowerCase();

// tests

describe("get voices", () => {

	const tts = new SimpleTTS();

	it("should return a voices array", () => {

		return tts.getVoices().then((voices) => {

			strictEqual(typeof voices, "object", "voices are not returned as an array");
			strictEqual(voices instanceof Array, true, "voices are not returned as an array");

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
