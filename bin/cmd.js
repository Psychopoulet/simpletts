#!/usr/bin/env node
"use strict";

// deps

	// locals
	const SimpleTTS = require(require("path").join(__dirname, "..", "lib", "main.js"));

// consts

	const ARGS = (0, process).argv.slice(2, (0, process).argv.length);

// module

if (!ARGS.length) {
	(0, console).error("There is no sentence to read");
	(0, process).exitCode = 1;
}
else if (1 < ARGS.length) {
	(0, console).error("There too many arguments");
	(0, process).exitCode = 1;
}
else {

	const TTS = new SimpleTTS();

	TTS.read(ARGS[0]).catch((err) => {
		(0, console).error(err);
		(0, process).exitCode = 1;
	});

}
