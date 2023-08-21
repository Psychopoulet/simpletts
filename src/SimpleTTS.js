"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// deps
// natives
var node_path_1 = require("node:path");
var node_os_1 = require("node:os");
var node_child_process_1 = require("node:child_process");
// locals
var parseVoicesEspeak_1 = require("./parseVoicesEspeak");
var parseVoicesSAPI_1 = require("./parseVoicesSAPI");
var readOptionsToEspeakArgs_1 = require("./readOptionsToEspeakArgs");
var readOptionsToSAPIArgs_1 = require("./readOptionsToSAPIArgs");
;
;
// consts
var IS_WINDOWS = "win32" === (0, node_os_1.platform)().trim().toLowerCase();
var CSCRIPT_ARGS = ["//NoLogo", "//B"];
// module
var SimpleTTS = /** @class */ (function () {
    // constructor
    function SimpleTTS(scriptsFolderPath) {
        if (scriptsFolderPath === void 0) { scriptsFolderPath = (0, node_path_1.join)(__dirname, "..", "batchs"); }
        this._forceStop = false;
        this._readPromise = null;
        this._reader = null;
        this._scriptsDirectory = scriptsFolderPath;
        this.defaultVoice = null;
        this.forceEspeak = false;
    }
    SimpleTTS.prototype.getTTSSystem = function () {
        return IS_WINDOWS && !this.forceEspeak ? "sapi" : "espeak";
    };
    SimpleTTS.prototype.getVoices = function () {
        var _this = this;
        var IS_SAPI = "sapi" === this.getTTSSystem();
        return new Promise(function (resolve, reject) {
            (0, node_child_process_1.exec)(IS_SAPI ?
                "cscript " + CSCRIPT_ARGS.join(" ") + " \"" + (0, node_path_1.join)(_this._scriptsDirectory, "listvoices.vbs") + "\"" :
                "espeak --voices", function (err, _stdout, stderr) {
                if (err) {
                    reject(stderr ? new Error(stderr) : err);
                }
                else {
                    var stdout = _stdout.trim().replace(/\r/g, "\n").replace(/\n\n/g, "\n").split("\n");
                    if (IS_SAPI) {
                        resolve((0, parseVoicesSAPI_1.default)(stdout.slice(1, stdout.length), stdout).map(function (voice) {
                            return {
                                "gender": voice.Gender.trim().toLowerCase(),
                                "name": voice.Name.trim().toLowerCase()
                            };
                        }));
                    }
                    else {
                        resolve((0, parseVoicesEspeak_1.default)(stdout.slice(1, stdout.length)).map(function (voice) {
                            return {
                                "gender": "F" === voice["Age/Gender"] ? "female" : "male",
                                "name": voice.VoiceName.trim().toLowerCase()
                            };
                        }));
                    }
                }
            });
        });
    };
    SimpleTTS.prototype.isReading = function () {
        return null !== this._reader;
    };
    SimpleTTS.prototype.read = function (_options) {
        var _this = this;
        this._forceStop = false;
        if ("undefined" === typeof _options) {
            return Promise.reject(new ReferenceError("Missing options parameter"));
        }
        else if ("object" !== typeof _options && "string" !== typeof _options) {
            return Promise.reject(new TypeError("options parameter is not an object or a string"));
        }
        else {
            var options_1 = "string" === typeof _options ? { "text": _options } : _options;
            if ("undefined" === typeof options_1.text) {
                return Promise.reject(new ReferenceError("Missing text parameter"));
            }
            else if ("string" !== typeof options_1.text) {
                return Promise.reject(new TypeError("text parameter is not a string"));
            }
            else if ("" === options_1.text.trim()) {
                return Promise.reject(new Error("text parameter is empty"));
            }
            else if (this.isReading()) {
                return Promise.reject(new Error("Already reading a text"));
            }
            else {
                var IS_SAPI_1 = "sapi" === this.getTTSSystem();
                this._readPromise = Promise.resolve().then(function () {
                    if (_this.defaultVoice) {
                        return;
                    }
                    else {
                        return _this.getVoices().then(function (voices) {
                            _this.defaultVoice = voices.length ? voices[0] : null;
                        });
                    }
                }).then(function () {
                    if ("object" !== typeof options_1.voice && "string" !== typeof options_1.voice) {
                        options_1.voice = _this.defaultVoice;
                    }
                    options_1.volume = "undefined" === typeof options_1.volume ? 100 : Math.round(options_1.volume);
                    options_1.volume = 0 > options_1.volume ? 0 : options_1.volume;
                    options_1.volume = 100 < options_1.volume ? 100 : options_1.volume;
                    options_1.speed = "undefined" === typeof options_1.speed ? 50 : Math.round(options_1.speed);
                    options_1.speed = 0 > options_1.speed ? 0 : options_1.speed;
                    options_1.speed = 100 < options_1.speed ? 100 : options_1.speed;
                    return _this._forceStop ? options_1 : Promise.resolve().then(function () {
                        var args = IS_SAPI_1 ?
                            (0, readOptionsToSAPIArgs_1.default)(options_1) :
                            (0, readOptionsToEspeakArgs_1.default)(options_1);
                        args.push(options_1.text);
                        return args;
                    }).then(function (args) {
                        return new Promise(function (resolve, reject) {
                            _this._reader = IS_SAPI_1 ?
                                (0, node_child_process_1.spawn)("cscript", CSCRIPT_ARGS.concat([(0, node_path_1.join)(_this._scriptsDirectory, "playtext.vbs")]).concat(args)) :
                                (0, node_child_process_1.spawn)("espeak", args);
                            var err = "";
                            if (_this._reader.stderr) {
                                _this._reader.stderr.on("data", function (data) {
                                    err += "string" === typeof data ? data : data.toString("ascii");
                                });
                            }
                            _this._reader.on("close", function (code) {
                                return code ? reject(new Error(err)) : resolve(options_1);
                            });
                        });
                    });
                }).then(function (data) {
                    _this._forceStop = false;
                    _this._reader = null;
                    return data;
                }).catch(function (err) {
                    _this._forceStop = false;
                    _this._reader = null;
                    return Promise.reject(err);
                });
                return this._readPromise;
            }
        }
    };
    SimpleTTS.prototype.stopReading = function () {
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
        return this._readPromise ? this._readPromise.then(function () {
            return Promise.resolve();
        }) : Promise.resolve();
    };
    return SimpleTTS;
}());
exports.default = SimpleTTS;
;
