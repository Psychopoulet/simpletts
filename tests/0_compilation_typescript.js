
"use strict";

// deps

	const { exec } = require("child_process");
	const { join } = require("path");
	const { unlink } = require("fs");

// consts

	const MAX_TIMEOUT = 10000;

// tests

describe("compilation typescript", () => {

	after((done) => {

		unlink(join(__dirname, "typescript", "compilation.js"), (err) => {
			return err ? done(err) : done();
		});

	});

	it("should compile typescript file", (done) => {

		exec("tsc " + join(__dirname, "typescript", "compilation.ts"), {
			"cwd": join(__dirname, ".."),
			"windowsHide": true
		}, (err) => {
			return err ? done(err) : done();
		});

	}).timeout(MAX_TIMEOUT);

});
