"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// module
exports.default = (function (options) {
    return [
        // 0 -> 100
        "-v",
        String(options.volume),
        // -10 -> 10
        "-r",
        String(Math.round(options.speed / 5) - 10),
        "-voice",
        "string" === typeof options.voice ? options.voice : options.voice.name
    ];
});
