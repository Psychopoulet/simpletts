// deps

    // natives
    const { strictEqual, deepStrictEqual } = require("node:assert");
    const { join } = require("node:path");

    // locals
    const parseVoicesEspeak = require(join(__dirname, "..", "lib", "src", "parseVoicesEspeak.ts")).default;
    const readOptionsToEspeakArgs = require(join(__dirname, "..", "lib", "src", "readOptionsToEspeakArgs.ts")).default;

// private

    const _pad = (value, length) => {
        return (value + " ".repeat(length)).slice(0, length);
    };

    const _voiceLine = (gender, name, other) => {
        return _pad("5", 4) + _pad("en", 15) + _pad(gender, 3) + _pad(name, 21) + _pad("en/en-us", 14) + other;
    };

// tests

describe("parseVoicesEspeak", () => {

    it("should parse espeak voice columns", () => {

        const voices = parseVoicesEspeak([
            "Pty Language Age/Gender VoiceName File Other Languages",
            _voiceLine("F", "female", "(en)"),
            _voiceLine("M", "male", "")
        ]);

        strictEqual(voices.length, 2);
        deepStrictEqual(voices[0], {
            "Pty": "5",
            "Language": "en",
            "Age/Gender": "F",
            "VoiceName": "female",
            "File": "en/en-us",
            "Other Languages": [ "en" ]
        });
        deepStrictEqual(voices[1], {
            "Pty": "5",
            "Language": "en",
            "Age/Gender": "M",
            "VoiceName": "male",
            "File": "en/en-us",
            "Other Languages": []
        });

    });

});

describe("readOptionsToEspeakArgs", () => {

    it("should format a voice name", () => {

        const args = readOptionsToEspeakArgs({
            "text": "test",
            "volume": 50,
            "speed": 50,
            "voice": "female"
        });

        deepStrictEqual(args, [ "-a", "100", "-s", "160", "-v", "female" ]);

    });

    it("should format a voice object", () => {

        const args = readOptionsToEspeakArgs({
            "text": "test",
            "volume": 100,
            "speed": 0,
            "voice": {
                "gender": "male",
                "name": "male"
            }
        });

        deepStrictEqual(args, [ "-a", "200", "-s", "80", "-v", "male" ]);

    });

});
