
"use strict";

// deps

	const	assert = require('assert'),
			SimpleTTS = require(require('path').join(__dirname, '..', 'main.js'));

// tests

describe('get system type', function() {

	it('should return a string', function() {
		assert.strictEqual('string', typeof SimpleTTS.getTTSSystem(), "TTS system not returned as a string");
	});

});

describe('get voices', function() {

	it('should return a voices array', function(done) {

		SimpleTTS.getVoices().then(function(voices) {
			assert.strictEqual(true, voices instanceof Array, "voices are not returned as an array");
			done();
		}).catch(done);

	});

});

describe('read', function() {

	it('should play a text with options', function(done) {

		SimpleTTS.getVoices().then(function(voices) {
			return SimpleTTS.read({text: "ceci est un test", voice: voices[0], speed: 70, volume: 30});
		}).then(done).catch(done);

	}).timeout(4000);

	it('should play a text without options', function(done) {
		SimpleTTS.read("ceci est un test").then(done).catch(done);
	}).timeout(4000);

});
