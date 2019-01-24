
"use strict";

// module

module.exports = (options) => {

	const speed = options.speed / 50 * 80;

	return [

		// 0 -> 200
		"-a",
		options.volume * 2,

		// 80 -> 240
		"-s",
		Math.round(speed + 80),

		"-v",
		"string" === typeof options.voice ? options.voice : options.voice.name

	];

};
