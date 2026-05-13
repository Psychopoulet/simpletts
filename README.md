# simpletts
A basic tss manager, based on Microsoft Speech API or espeak for others OS.

[![Lines of Code](https://sonarcloud.io/api/project_badges/measure?project=Psychopoulet_simpletts&metric=ncloc)](https://sonarcloud.io/summary/new_code?id=Psychopoulet_simpletts)
[![Issues](https://img.shields.io/github/issues/Psychopoulet/simpletts.svg)](https://github.com/Psychopoulet/simpletts/issues)
[![Pull requests](https://img.shields.io/github/issues-pr/Psychopoulet/simpletts.svg)](https://github.com/Psychopoulet/simpletts/pulls)

[![Reliability Rating](https://sonarcloud.io/api/project_badges/measure?project=Psychopoulet_simpletts&metric=reliability_rating)](https://sonarcloud.io/summary/new_code?id=Psychopoulet_simpletts)
[![Security Rating](https://sonarcloud.io/api/project_badges/measure?project=Psychopoulet_simpletts&metric=security_rating)](https://sonarcloud.io/summary/new_code?id=Psychopoulet_simpletts)
[![Maintainability Rating](https://sonarcloud.io/api/project_badges/measure?project=Psychopoulet_simpletts&metric=sqale_rating)](https://sonarcloud.io/summary/new_code?id=Psychopoulet_simpletts)
[![Vulnerabilities](https://sonarcloud.io/api/project_badges/measure?project=Psychopoulet_simpletts&metric=vulnerabilities)](https://sonarcloud.io/summary/new_code?id=Psychopoulet_simpletts)
[![Bugs](https://sonarcloud.io/api/project_badges/measure?project=Psychopoulet_simpletts&metric=bugs)](https://sonarcloud.io/summary/new_code?id=Psychopoulet_simpletts)

[![Known Vulnerabilities](https://snyk.io/test/github/Psychopoulet/simpletts/badge.svg)](https://snyk.io/test/github/Psychopoulet/simpletts)

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

## ElectronJS

When using with electronjs in Windows, you can move "vbs" scripts to external folder and pass folder path in constructor.

```javascript
/**
 * move "listvoices.vbs" and "playtext.vbs" in
 * "./node_modules/simpletts/batchs" to external folder.
 * ex: ./plugins/vbs/*
 */
const { resolve } = require("path");
const SimpleTTS = require("simpletts");
const vbsFolders = resolve("plugins", "vbs");
const simpleTTS = new SimpleTTS(vbsFolders);
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
