
"use strict";

// types & interfaces

	// locals
	export interface iESpeakVoice {
		"Pty": string;
		"Language": string;
		"Age/Gender": "M" | "F" | "-";
		"VoiceName": string;
		"File": string;
		"Other Languages": Array<string>;
	};

// module

export default function parseVoicesEspeak (voices: Array<string>): Array<iESpeakVoice> {

	const PTY_LENGTH = 4;
	const LANGUAGE_LENGTH = 15;
	const AGE_GENDER_LENGTH = 3;
	const VOICENAME_LENGTH = 21;
	const FILE_LENGTH = 14;

	voices.shift() as string; // remove headers

	return voices.map((voice: string): iESpeakVoice => {

		return {
			"Pty": voice.slice(0, PTY_LENGTH).trim(),
			"Language": voice.slice(PTY_LENGTH, PTY_LENGTH + LANGUAGE_LENGTH).trim(),
			"Age/Gender": voice.slice(PTY_LENGTH + LANGUAGE_LENGTH, PTY_LENGTH + LANGUAGE_LENGTH + AGE_GENDER_LENGTH).trim() as iESpeakVoice["Age/Gender"],
			"VoiceName": voice.slice(PTY_LENGTH + LANGUAGE_LENGTH + AGE_GENDER_LENGTH, PTY_LENGTH + LANGUAGE_LENGTH + AGE_GENDER_LENGTH + VOICENAME_LENGTH).trim(),
			"File": voice.slice(PTY_LENGTH + LANGUAGE_LENGTH + AGE_GENDER_LENGTH + VOICENAME_LENGTH, PTY_LENGTH + LANGUAGE_LENGTH + AGE_GENDER_LENGTH + VOICENAME_LENGTH + FILE_LENGTH).trim(),
			"Other Languages": voice.slice(PTY_LENGTH + LANGUAGE_LENGTH + AGE_GENDER_LENGTH + VOICENAME_LENGTH + FILE_LENGTH, voice.length).split("(").map((other: string): string => {
				return other.trim().replace("(", "").replace(")", "");
			}).filter((other: string): boolean => {
				return !!other.length;
			})
		};

	});

};
