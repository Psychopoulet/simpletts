
"use strict";

// deps

	const assert = require("assert");
	const simpletts = require(require("path").join(__dirname, "..", "lib", "main.js"));

// tests

describe("get system type", () => {

	it("should return a string", () => {
		assert.strictEqual("string", typeof simpletts.getTTSSystem(), "TTS system not returned as a string");
	});

});

describe("get voices", () => {

	it("should return a voices array", () => {

		return simpletts.getVoices().then((voices) => {
			assert.strictEqual(true, voices instanceof Array, "voices are not returned as an array");
			return Promise.resolve();
		});

	});

});

describe("read", () => {

	it("should play a text with options", () => {

		return simpletts.getVoices().then((voices) => {
			return simpletts.read({text: "ceci est un test", voice: voices[0], speed: 70, volume: 30});
		});

	}).timeout(4000);

	it("should play a text without options", () => {
		return simpletts.read("ceci est un test");
	}).timeout(4000);

});
