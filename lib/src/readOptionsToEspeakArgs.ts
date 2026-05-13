
"use strict";

// types & interfaces

	// locals
	import { iOptions, iVoice } from "./SimpleTTS";

// module

export default (options: iOptions): Array<string> => {

	const speed: number = options.speed as number / 50 * 80;

	return [

		// 0 -> 200
		"-a",
		String(options.volume as number * 2),

		// 80 -> 240
		"-s",
		String(Math.round(speed + 80)),

		"-v",
		"string" === typeof options.voice ? options.voice : (options.voice as iVoice).name

	];

};
