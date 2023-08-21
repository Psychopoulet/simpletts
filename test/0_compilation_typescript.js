
"use strict";

// deps

	// natives
	const { exec } = require("node:child_process");
	const { join } = require("node:path");
	const { unlink } = require("node:fs/promises");

// consts

	const MAX_TIMEOUT = 10000;

// tests

describe("compilation typescript", () => {

	after(() => {
		return unlink(join(__dirname, "typescript", "compilation.js"));
	});

	it("should compile typescript file", (done) => {

		exec("npx tsc " + join(__dirname, "typescript", "compilation.ts"), {
			"cwd": join(__dirname, ".."),
			"windowsHide": true
		}, (err) => {
			return err ? done(err) : done();
		});

	}).timeout(MAX_TIMEOUT);

});
