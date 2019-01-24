
"use strict";

// deps

	// natives
	const { readFile } = require("fs");
	const { join } = require("path");

	// locals
	const SimpleTTS = require(join(__dirname, "..", "lib", "main.js"));

// tests

describe("read", () => {

	const tts = new SimpleTTS();

	it("should stop not reading process", () => {
		return tts.stopReading();
	});

	it("should stop read wih no default voice", () => {

		tts.read("this is a test running");

		return tts.stopReading();

	});

	it("should stop read wih default voice", () => {

		return new Promise((resolve, reject) => {

			readFile(join(__dirname, "lorem.txt"), "utf8", (err, content) => {
				return err ? reject(err) : resolve(content);
			});

		}).then((content) => {

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
