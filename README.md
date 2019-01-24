# simpletts
A basic tss manager, based on Microsoft Speech API or espeak for others OS

[![Build status](https://api.travis-ci.org/Psychopoulet/simpletts.svg?branch=master)](https://travis-ci.org/Psychopoulet/simpletts)
[![Coverage status](https://coveralls.io/repos/github/Psychopoulet/simpletts/badge.svg?branch=master)](https://coveralls.io/github/Psychopoulet/simpletts)
[![Dependency status](https://david-dm.org/Psychopoulet/simpletts/status.svg)](https://david-dm.org/Psychopoulet/simpletts)
[![Dev dependency status](https://david-dm.org/Psychopoulet/simpletts/dev-status.svg)](https://david-dm.org/Psychopoulet/simpletts?type=dev)
[![Issues](https://img.shields.io/github/issues/Psychopoulet/simpletts.svg)](https://github.com/Psychopoulet/simpletts/issues)
[![Pull requests](https://img.shields.io/github/issues-pr/Psychopoulet/simpletts.svg)](https://github.com/Psychopoulet/simpletts/pulls)

## Installation

```bash
$ npm install simpletts
```

### Espeak (if not SAPI)

* On Linux

```bash
$ apt-get install espeak
```

* Or, download installer

http://espeak.sourceforge.net/download.html

## Features

  * simply read & play text

## Doc

### Attributes

  * ``` defaultVoice: Voice (default = null) ```
  * ``` forceEspeak: boolean (default = false) ```

### Methods

  * ``` getTTSSystem(void): "sapi" | "espeak" ```
  * ``` getVoices(void): Promise<resolve<Array<Voice>>|reject<Error>> ```
  * ``` isReading(void): boolean ```
  * ``` read(Options|string): Promise<resolve<Options>|reject<Error>> ```
  * ``` stopReading(void): Promise<resolve<void>|reject<Error>> ```

### Interfaces

```javascript
interface Voice {
	name: string,
	gender: "female" | "male"
}

interface Options {
	text: string,
	< voice: Voice|string, >
	< integer volume, > // percentage, 0 -> 100, default 100
	< integer speed > // percentage, 0 -> 100, default 50
}
```

## Examples

### Bash

```bash
$ npx run-script simpletts "This is a test"
```

### Typescript

```typescript
import SimpleTTS = require("simpletts");

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

const tts = new SimpleTTS();

tts.getVoices().then((voices: Array<Voice>) => {

	return tts.read({
		"text": "test",
		"voice": voices[0]
	});

}).then((options: Options) => {
	console.log(options);
}).catch((err: Error) => {
	console.log(err);
});
```

### Native

```javascript
const SimpleTTS = require("simpletts");
const tts = new SimpleTTS();

tts.getVoices().then((voices) => {

	console.log(voices[0].name);
	console.log(voices[0].gender);

}).catch((err) => {
	console.log(err);
});

tts.read({ "text": "this is a test", "volume": 75, "speed": 60 }).then(() => {
	console.log("Ok");
}).catch((err) => {
	console.log(err);
});

tts.read("this is a test").then(() => { // is equal to { "text": "this is a test", "voice": voices[0], "volume": 100, "speed": 50 }
	console.log("Ok");
}).catch((err) => {
	console.log(err);
});
```

## Tests

```bash
$ npm run-script tests
```

## License

  [ISC](LICENSE)
