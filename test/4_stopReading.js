
"use strict";

// deps

	// natives
	const { readFile } = require("node:fs/promises");
	const { join } = require("node:path");

	// locals
	const SimpleTTS = require(join(__dirname, "..", "lib", "main.js"));

// tests

describe("stopReading", () => {

	const tts = new SimpleTTS();

	it("should stop not reading process", () => {
		return tts.stopReading();
	});

	it("should stop read wih no default voice", () => {

		tts.read("this is a test running");

		return tts.stopReading();

	});

	it("should stop read wih default voice", () => {

		return readFile(join(__dirname, "lorem.txt"), "utf8").then((content) => {

			tts.read(content);

			return new Promise((resolve, reject) => {

				setTimeout(() => {

					tts.stopReading().then(() => {
						resolve();
					}).catch(reject);

				}, 1000);

			});

		});

	});

});
