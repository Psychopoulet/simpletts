"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// module
exports.default = (function (options) {
    var speed = options.speed / 50 * 80;
    return [
        // 0 -> 200
        "-a",
        String(options.volume * 2),
        // 80 -> 240
        "-s",
        String(Math.round(speed + 80)),
        "-v",
        "string" === typeof options.voice ? options.voice : options.voice.name
    ];
});
