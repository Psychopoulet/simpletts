"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
;
// module
function parseVoicesSAPI(voices, stdout) {
    var headers = stdout[0].split(";");
    var result = [];
    for (var i = 0; i < voices.length; ++i) {
        var tmp = {
            "Gender": "",
            "Name": ""
        };
        var voice = voices[i].split(";");
        for (var j = 0; j < headers.length; ++j) {
            tmp[headers[j]] = voice[j].trim();
        }
        result.push(tmp);
    }
    return result;
}
exports.default = parseVoicesSAPI;
;
