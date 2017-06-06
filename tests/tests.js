
"use strict";

// deps

	const	assert = require("assert"),
			SimpleTTS = require(require("path").join(__dirname, "..", "lib", "main.js"));

// tests

describe("get system type", () => {

	it("should return a string", () => {
		assert.strictEqual("string", typeof SimpleTTS.getTTSSystem(), "TTS system not returned as a string");
	});

});

describe("get voices", () => {

	it("should return a voices array", () => {

		return SimpleTTS.getVoices().then((voices) => {


			console.log(voices);

			assert.strictEqual(true, voices instanceof Array, "voices are not returned as an array");
			return Promise.resolve();
		});

	});

});

describe("read", () => {

	it("should play a text with options", () => {

		return SimpleTTS.getVoices().then((voices) => {
			return SimpleTTS.read({text: "ceci est un test", voice: voices[0], speed: 70, volume: 30});
		});

	}).timeout(4000);

	it("should play a text without options", () => {
		return SimpleTTS.read("ceci est un test");
	}).timeout(4000);

});
