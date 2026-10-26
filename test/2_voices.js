// deps

    // natives
    const { strictEqual } = require("node:assert");
    const { join } = require("node:path");

    // locals
    const SimpleTTS = require(join(__dirname, "..", "lib", "src", "main.cts"));

// consts

    const MAX_TIMEOUT = 10000;

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

    it("should test force espeak", () => {

        tts.forceEspeak = true;

        return tts.getVoices();

    }).timeout(MAX_TIMEOUT);

});
