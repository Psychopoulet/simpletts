
"use strict";

// types & interfaces

	// locals
	export interface iSAPIVoice {
		"Gender": string;
		"Age": string;
		"Name": string;
		"Language": string;
		"Vendor": string;
		"Version": string;
	};

// module

export default function parseVoicesSAPI (voices: Array<string>): Array<iSAPIVoice> {

	const headersLine: string = voices.shift() as string; // remove headers
	const headers: Array<string> = headersLine.split("|"); // compulse headers

	return voices.map((voice: string): Array<string> => {
		return voice.split("|");
	}).map((voiceData: Array<string>): iSAPIVoice => {

		const result: iSAPIVoice = {
			"Gender": "",
			"Age": "",
			"Name": "",
			"Language": "",
			"Vendor": "",
			"Version": ""
		};

			for (let j: number = 0; j < headers.length; ++j) {
				result[headers[j] as "Gender" | "Age" | "Name" | "Language" | "Vendor" | "Version"] = voiceData[j].trim();
			}

		return result;

	});

};
