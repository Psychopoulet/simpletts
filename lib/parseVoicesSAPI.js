
"use strict";

// module

module.exports = (voices, stdout) => {

	const headers = stdout[0].split(";");

	for (let i = 0; i < voices.length; ++i) {

		const voice = voices[i].split(";");
		voices[i] = {};

		for (let j = 0; j < headers.length; ++j) {
			voices[i][headers[j]] = voice[j].trim();
		}

	}

	return voices;

};
