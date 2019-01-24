
"use strict";

// module

module.exports = (options) => {

	return [

		// 0 -> 100
		"-v",
		options.volume,

		// -10 -> 10
		"-r",
		Math.round(options.speed / 5) - 10,

		"-voice",
		"string" === typeof options.voice ? options.voice : options.voice.name

	];

};
