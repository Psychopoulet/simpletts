/// <reference types="node" />

declare module "simpletts" {

	import { ChildProcess } from "child_process";

	interface Voice {
		name: string;
		gender: "female" | "male";
	}

	interface Options {
		text: string;
		volume?: number;
		speed?: number;
		voice?: Voice | string;
	}

	class SimpleTTS {

		protected _forceStop: boolean;
		protected _readPromise: null | Promise<Options>;

		public defaultVoice: null | Voice;
		public forceEspeak: boolean;
		public reader: null | ChildProcess;

		constructor();

		public getTTSSystem(): "SAPI" | "espeak";
		public getVoices(): Promise<Array<Voice>>;
		public isReading(): boolean;
		public read(options: Options | string): Promise<Options>;
		public stopReading(): Promise<void>;

	}

	export = SimpleTTS;

}
