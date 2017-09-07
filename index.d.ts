declare module 'simpletts' {
	const SimpleTTS: SimpleTTSLib.SimpleTTS;

	namespace SimpleTTSLib {

			interface Voice {
					name: string;
					gender?: string;
			}

			interface ReadOptions {
					text: string;
					volume?: number;
					speed?: number;
					voice?: Voice | string;
			}

			type Readable = ReadOptions | string;

			class SimpleTTS {
					public getTTSSystem(): 'SAPI' | 'espeak';
					public setDefaultVoice(voice: Voice | string): void;
					public getVoices(): Promise<Voice[]>;
					public read(text: Readable): Promise<void>;
			}
	}

	export = SimpleTTS;
}
