// deps

    // natives
    const { strictEqual } = require("node:assert");
    const { join } = require("node:path");

    // locals
    const SimpleTTS = require(join(__dirname, "..", "lib", "src", "main.cts"));

// private

    function _waitForReader (tts) {

        const started = Date.now();

        function poll () {

            if (tts._reader) {
                return Promise.resolve();
            }

            if (1000 < Date.now() - started) {
                return Promise.reject(new Error("reader was not started"));
            }

            return new Promise((resolve) => {
                setTimeout(resolve, 10);
            }).then(poll);

        }

        return poll();

    }

// tests

describe("getTTSSystem", () => {

    it("should use espeak when it is forced", () => {

        const tts = new SimpleTTS();

        tts.forceEspeak = true;

        strictEqual(tts.getTTSSystem(), "espeak");

    });

});

describe("getVoices failures", () => {

    it("should reject with stderr when listing voices fails", () => {

        const tts = new SimpleTTS(join(__dirname, "fixtures", "stderr"));

        return tts.getVoices().then(() => {
            return Promise.reject(new Error("There is no generated Error"));
        }, (err) => {

            strictEqual(err instanceof Error, true);
            strictEqual(err.message.includes("list failed"), true);

        });

    });

    it("should reject with the process error when stderr is empty", () => {

        const tts = new SimpleTTS(join(__dirname, "fixtures", "no-stderr"));

        return tts.getVoices().then(() => {
            return Promise.reject(new Error("There is no generated Error"));
        }, (err) => {

            strictEqual(err instanceof Error, true);
            strictEqual(err.message.includes("Command failed"), true);

        });

    });

});

describe("read failures", () => {

    it("should keep a null default voice when no voice is installed", () => {

        const tts = new SimpleTTS(join(__dirname, "fixtures", "empty-voices"));

        return tts.read({
            "text": "test",
            "voice": "testvoice"
        }).then((options) => {

            strictEqual(tts.defaultVoice, null);
            strictEqual(options.voice, "testvoice");
            strictEqual(options.volume, 100);
            strictEqual(options.speed, 50);

        });

    });

    it("should reject when playback exits with an error", () => {

        const tts = new SimpleTTS(join(__dirname, "fixtures", "play-fails"));

        return tts.read("test").then(() => {
            return Promise.reject(new Error("There is no generated Error"));
        }, (err) => {

            strictEqual(err instanceof Error, true);
            strictEqual(err.message.includes("play failed"), true);
            strictEqual(tts.isReading(), false);

        });

    });

    it("should reject when stopping the reader throws", () => {

        const tts = new SimpleTTS(join(__dirname, "fixtures", "slow-play"));

        tts.defaultVoice = {
            "gender": "female",
            "name": "testvoice"
        };

        const reading = tts.read("test");

        reading.catch(() => {
            return null;
        });

        return _waitForReader(tts).then(() => {

            const reader = tts._reader;
            const kill = reader.kill.bind(reader);

            reader.kill = () => {
                throw new Error("kill failed");
            };

            return tts.stopReading().then(() => {
                return Promise.reject(new Error("There is no generated Error"));
            }, (err) => {

                strictEqual(err instanceof Error, true);
                strictEqual(err.message, "kill failed");

                reader.kill = kill;
                reader.kill();

            });

        });

    });

});
