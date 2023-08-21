"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
;
// module
function parseVoicesEspeak(voices) {
    var result = [];
    for (var i = 0; i < voices.length; ++i) {
        var voice = voices[i].trim();
        voice = voice.slice(1, voice.length).trim();
        var tmp = {
            "Language": voice.slice(0, 15).trim(),
            "Age/Gender": voice.slice(0, 3).trim(),
            "VoiceName": voice.slice(0, 21).trim(),
            "File": voice.slice(0, 14).trim(),
            "Others": []
        };
        /*voices[i].Language = voice.slice(0, 15).trim();
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

        }*/
        result.push(tmp);
    }
    return result;
}
exports.default = parseVoicesEspeak;
;
