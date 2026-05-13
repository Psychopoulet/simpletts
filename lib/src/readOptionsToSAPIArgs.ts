// types & interfaces

    // locals
    import type { iOptions, iVoice } from "./SimpleTTS";

// module

export default (options: iOptions): string[] => {

    return [

        // 0 -> 100
        "-v",
        String(options.volume),

        // -10 -> 10
        "-r",
        String(Math.round(options.speed as number / 5) - 10),

        "-voice",
        "string" === typeof options.voice ? options.voice : (options.voice as iVoice).name

    ];

};
