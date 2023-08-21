
"use strict";

// deps

	// natives
	const { strictEqual } = require("node:assert");
	const { join } = require("node:path");

	// locals
	const SimpleTTS = require(join(__dirname, "..", "lib", "cjs", "main.cjs"));

// tests

describe("get system type", () => {

	const tts = new SimpleTTS();

	it("should return a string", () => {
		strictEqual(typeof tts.getTTSSystem(), "string", "TTS system not returned as a string");
		strictEqual([ "espeak", "sapi" ].includes(tts.getTTSSystem()), true, "TTS system not returned as a string");
	});

});
