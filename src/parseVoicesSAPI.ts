
"use strict";

// types & interfaces

	// locals
	export interface iSAPIVoice {
		"Gender": string;
		"Name": string;
	};

// module

export default function parseVoicesSAPI (voices: Array<string>, stdout: Array<string>): Array<iSAPIVoice> {

	const headers: Array<string> = stdout[0].split(";");

	const result: Array<iSAPIVoice> = [];

		for (let i: number = 0; i < voices.length; ++i) {

			const tmp: iSAPIVoice = {
				"Gender": "",
				"Name": ""
			};

				const voice: Array<string> = voices[i].split(";");

				for (let j: number = 0; j < headers.length; ++j) {
					tmp[headers[j] as "Gender" | "Name"] = voice[j].trim();
				}

			result.push(tmp);

		}

	return result;

};
