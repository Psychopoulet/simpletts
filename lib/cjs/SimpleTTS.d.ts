export interface iVoice {
    name: string;
    gender: "female" | "male";
}
export interface iOptions {
    text: string;
    volume?: number;
    speed?: number;
    voice?: iVoice | string;
}
export default class SimpleTTS {
    private _forceStop;
    private _readPromise;
    private _reader;
    private _scriptsDirectory;
    defaultVoice: iVoice | null;
    forceEspeak: boolean;
    constructor(scriptsFolderPath?: string);
    getTTSSystem(): "sapi" | "espeak";
    getVoices(): Promise<Array<iVoice>>;
    isReading(): boolean;
    read(_options: iOptions | string): Promise<iOptions>;
    stopReading(): Promise<void>;
}
