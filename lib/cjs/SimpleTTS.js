"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// deps
// natives
const node_path_1 = require("node:path");
const node_os_1 = require("node:os");
const node_child_process_1 = require("node:child_process");
// locals
const parseVoicesEspeak_1 = __importDefault(require("./parseVoicesEspeak"));
const parseVoicesSAPI_1 = __importDefault(require("./parseVoicesSAPI"));
const readOptionsToEspeakArgs_1 = __importDefault(require("./readOptionsToEspeakArgs"));
const readOptionsToSAPIArgs_1 = __importDefault(require("./readOptionsToSAPIArgs"));
;
;
// consts
const IS_WINDOWS = "win32" === (0, node_os_1.platform)().trim().toLowerCase();
const CSCRIPT_ARGS = ["//NoLogo", "//B"];
// module
class SimpleTTS {
    // constructor
    constructor(scriptsFolderPath = (0, node_path_1.join)(__dirname, "..", "..", "batchs")) {
        this._forceStop = false;
        this._readPromise = null;
        this._reader = null;
        this._scriptsDirectory = scriptsFolderPath;
        this.defaultVoice = null;
        this.forceEspeak = false;
    }
    getTTSSystem() {
        return IS_WINDOWS && !this.forceEspeak ? "sapi" : "espeak";
    }
    getVoices() {
        const IS_SAPI = "sapi" === this.getTTSSystem();
        return new Promise((resolve, reject) => {
            (0, node_child_process_1.exec)(IS_SAPI ?
                "cscript " + CSCRIPT_ARGS.join(" ") + " \"" + (0, node_path_1.join)(this._scriptsDirectory, "listvoices.vbs") + "\"" :
                "espeak --voices", (err, _stdout, stderr) => {
                if (err) {
                    reject(stderr ? new Error(stderr) : err);
                }
                else {
                    const lines = _stdout.trim().replace(/\r/g, "\n").replace(/\n\n/g, "\n").split("\n");
                    if (IS_SAPI) {
                        resolve((0, parseVoicesSAPI_1.default)(lines).map((voice) => {
                            return {
                                "gender": voice.Gender.trim().toLowerCase(),
                                "name": voice.Name.trim().toLowerCase()
                            };
                        }));
                    }
                    else {
                        resolve((0, parseVoicesEspeak_1.default)(lines).map((voice) => {
                            return {
                                "gender": "F" === voice["Age/Gender"] ? "female" : "male",
                                "name": voice.VoiceName.trim().toLowerCase()
                            };
                        }));
                    }
                }
            });
        });
    }
    isReading() {
        return null !== this._reader;
    }
    read(_options) {
        this._forceStop = false;
        if ("undefined" === typeof _options) {
            return Promise.reject(new ReferenceError("Missing options parameter"));
        }
        else if ("object" !== typeof _options && "string" !== typeof _options) {
            return Promise.reject(new TypeError("options parameter is not an object or a string"));
        }
        else {
            const options = "string" === typeof _options ? { "text": _options } : _options;
            if ("undefined" === typeof options.text) {
                return Promise.reject(new ReferenceError("Missing text parameter"));
            }
            else if ("string" !== typeof options.text) {
                return Promise.reject(new TypeError("text parameter is not a string"));
            }
            else if ("" === options.text.trim()) {
                return Promise.reject(new Error("text parameter is empty"));
            }
            else if (this.isReading()) {
                return Promise.reject(new Error("Already reading a text"));
            }
            else {
                const IS_SAPI = "sapi" === this.getTTSSystem();
                this._readPromise = Promise.resolve().then(() => {
                    if (this.defaultVoice) {
                        return;
                    }
                    else {
                        return this.getVoices().then((voices) => {
                            this.defaultVoice = voices.length ? voices[0] : null;
                        });
                    }
                }).then(() => {
                    if ("object" !== typeof options.voice && "string" !== typeof options.voice) {
                        options.voice = this.defaultVoice;
                    }
                    options.volume = "undefined" === typeof options.volume ? 100 : Math.round(options.volume);
                    options.volume = 0 > options.volume ? 0 : options.volume;
                    options.volume = 100 < options.volume ? 100 : options.volume;
                    options.speed = "undefined" === typeof options.speed ? 50 : Math.round(options.speed);
                    options.speed = 0 > options.speed ? 0 : options.speed;
                    options.speed = 100 < options.speed ? 100 : options.speed;
                    return this._forceStop ? options : Promise.resolve().then(() => {
                        const args = IS_SAPI ?
                            (0, readOptionsToSAPIArgs_1.default)(options) :
                            (0, readOptionsToEspeakArgs_1.default)(options);
                        args.push(options.text);
                        return args;
                    }).then((args) => {
                        return new Promise((resolve, reject) => {
                            this._reader = IS_SAPI ?
                                (0, node_child_process_1.spawn)("cscript", CSCRIPT_ARGS.concat([(0, node_path_1.join)(this._scriptsDirectory, "playtext.vbs")]).concat(args)) :
                                (0, node_child_process_1.spawn)("espeak", args);
                            let err = "";
                            if (this._reader.stderr) {
                                this._reader.stderr.on("data", (data) => {
                                    err += "string" === typeof data ? data : data.toString("ascii");
                                });
                            }
                            this._reader.on("close", (code) => {
                                return code ? reject(new Error(err)) : resolve(options);
                            });
                        });
                    });
                }).then((data) => {
                    this._forceStop = false;
                    this._reader = null;
                    return data;
                }).catch((err) => {
                    this._forceStop = false;
                    this._reader = null;
                    return Promise.reject(err);
                });
                return this._readPromise;
            }
        }
    }
    stopReading() {
        if (this._reader) {
            try {
                this._reader.kill();
                this._reader = null;
            }
            catch (e) {
                return Promise.reject(e);
            }
        }
        else {
            this._forceStop = true;
        }
        return this._readPromise ? this._readPromise.then(() => {
            return Promise.resolve();
        }) : Promise.resolve();
    }
}
exports.default = SimpleTTS;
;
