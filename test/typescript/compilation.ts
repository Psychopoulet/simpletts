import SimpleTTS, { iVoice, iOptions } from "../../src/SimpleTTS";

const tts = new SimpleTTS();

tts.getVoices().then((voices: Array<iVoice>): Promise<iOptions> => {

	return tts.read({
		"text": "test",
		"voice": voices[0]
	});

}).then((options: iOptions): void => {
	console.log(options);
}).catch((err: Error): void => {
	console.log(err);
});
