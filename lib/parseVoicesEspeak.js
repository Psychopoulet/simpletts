
"use strict";

// module

module.exports = (voices) => {

	for (let i = 0; i < voices.length; ++i) {

		let voice = voices[i].trim(); voice = voice.slice(1, voice.length).trim();
		voices[i] = {};

		voices[i].Language = voice.slice(0, 15).trim();
		voice = voice.slice(15, voice.length);

		voices[i]["Age/Gender"] = voice.slice(0, 3).trim();
		voice = voice.slice(3, voice.length);

		voices[i].VoiceName = voice.slice(0, 21).trim();
		voice = voice.slice(21, voice.length);

		voices[i].File = voice.slice(0, 14).trim();
		voice = voice.slice(14, voice.length).trim();

		voices[i].Others = [];
		if (0 < voice.length) {

			const others = voice.split("(");

			for (let j = 0; j < others.length; ++j) {

				if ("" !== others[j]) {
					voices[i].Others.push(others[j].slice(0, others[j].length - 1));
				}

			}

		}

	}

	return voices;

};
