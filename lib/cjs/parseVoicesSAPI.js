"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
;
// module
function parseVoicesSAPI(voices) {
    const headersLine = voices.shift(); // remove headers
    const headers = headersLine.split("|"); // compulse headers
    return voices.map((voice) => {
        return voice.split("|");
    }).map((voiceData) => {
        const result = {
            "Gender": "",
            "Age": "",
            "Name": "",
            "Language": "",
            "Vendor": "",
            "Version": ""
        };
        for (let j = 0; j < headers.length; ++j) {
            result[headers[j]] = voiceData[j].trim();
        }
        return result;
    });
}
exports.default = parseVoicesSAPI;
;
