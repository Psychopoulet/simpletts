declare module "simpletts" {

	namespace SimpleTTS {

		var Promise: any;
		var ChildProcess: any;

		type resolve<T> = (value?: T | PromiseLike<T>) => void;
		type reject<T> = (error: T | PromiseLike<T>) => void;

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

			public constructor();

			protected _forceStop: boolean;
			protected _readPromise: null | Promise<any>;

			public defaultVoice: null | Voice;
			public forceEspeak: boolean;
			public reader: null | any;

			public getTTSSystem(): "SAPI" | "espeak";
			public getVoices(): Promise<resolve< Array<Voice>> | reject<Error> >;
	  		public isReading(): boolean;
	  		public read(options: Options | string): Promise< resolve<Options> | reject<Error> >;
	  		public stopReading(): Promise< resolve<void> | reject<Error> >;

		}

	}

	export = SimpleTTS.SimpleTTS;

}