"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
;
// module
function parseVoicesSAPI(voices, stdout) {
    const headers = stdout[0].split(";");
    const result = [];
    for (let i = 0; i < voices.length; ++i) {
        const tmp = {
            "Gender": "",
            "Name": ""
        };
        const voice = voices[i].split(";");
        for (let j = 0; j < headers.length; ++j) {
            tmp[headers[j]] = voice[j].trim();
        }
        result.push(tmp);
    }
    return result;
}
exports.default = parseVoicesSAPI;
;
