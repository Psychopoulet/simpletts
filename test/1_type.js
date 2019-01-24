
"use strict";

// deps

	// natives
	const assert = require("assert");

	// locals
	const SimpleTTS = require(require("path").join(__dirname, "..", "lib", "main.js"));

// tests

describe("get system type", () => {

	const tts = new SimpleTTS();

	it("should return a string", () => {
		assert.strictEqual(typeof tts.getTTSSystem(), "string", "TTS system not returned as a string");
		assert.strictEqual([ "espeak", "sapi" ].includes(tts.getTTSSystem()), true, "TTS system not returned as a string");
	});

});
