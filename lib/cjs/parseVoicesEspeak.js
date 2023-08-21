"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
;
// module
function parseVoicesEspeak(voices) {
    const PTY_LENGTH = 4;
    const LANGUAGE_LENGTH = 15;
    const AGE_GENDER_LENGTH = 3;
    const VOICENAME_LENGTH = 21;
    const FILE_LENGTH = 14;
    voices.shift(); // remove headers
    return voices.map((voice) => {
        return {
            "Pty": voice.slice(0, PTY_LENGTH).trim(),
            "Language": voice.slice(PTY_LENGTH, PTY_LENGTH + LANGUAGE_LENGTH).trim(),
            "Age/Gender": voice.slice(PTY_LENGTH + LANGUAGE_LENGTH, PTY_LENGTH + LANGUAGE_LENGTH + AGE_GENDER_LENGTH).trim(),
            "VoiceName": voice.slice(PTY_LENGTH + LANGUAGE_LENGTH + AGE_GENDER_LENGTH, PTY_LENGTH + LANGUAGE_LENGTH + AGE_GENDER_LENGTH + VOICENAME_LENGTH).trim(),
            "File": voice.slice(PTY_LENGTH + LANGUAGE_LENGTH + AGE_GENDER_LENGTH + VOICENAME_LENGTH, PTY_LENGTH + LANGUAGE_LENGTH + AGE_GENDER_LENGTH + VOICENAME_LENGTH + FILE_LENGTH).trim(),
            "Other Languages": voice.slice(PTY_LENGTH + LANGUAGE_LENGTH + AGE_GENDER_LENGTH + VOICENAME_LENGTH + FILE_LENGTH, voice.length).split("(").map((other) => {
                return other.trim().replace("(", "").replace(")", "");
            }).filter((other) => {
                return !!other.length;
            })
        };
    });
}
exports.default = parseVoicesEspeak;
;
