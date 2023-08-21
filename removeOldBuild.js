
"use strict";

// deps

	// natives
	const { join } = require("node:path");
	const { rm } = require("node:fs/promises");
	const { lstat } = require("node:fs");

// consts

	const BUILD_DIR = join(__dirname, "lib");

// exec

return new Promise((resolve) => {

	lstat(BUILD_DIR, (err, stats) => {
		return resolve(Boolean(!err && stats.isDirectory()));
	});

}).then((exists) => {

	return exists ? rm(BUILD_DIR, {
		"recursive": true
	}) : Promise.resolve();

}).then(() => {

	process.exitCode = 0;
	process.exit(0);

}).catch((err) => {

	(0, console).error(err);

	process.exitCode = 1;
	process.exit(1);

});
