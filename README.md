# simpletts
A basic tss manager, based on Microsoft Speech API or espeak for others OS

[![Build Status](https://api.travis-ci.org/Psychopoulet/simpletts.svg?branch=master)](https://travis-ci.org/Psychopoulet/simpletts)
[![Coverage Status](https://coveralls.io/repos/github/Psychopoulet/simpletts/badge.svg?branch=master)](https://coveralls.io/github/Psychopoulet/simpletts)
[![Dependency Status](https://img.shields.io/david/Psychopoulet/simpletts/master.svg)](https://github.com/Psychopoulet/simpletts)

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

```javascript
interface Voice {
	name: string,
	gender: string ("male"|"female")
}

interface Options {
	text: string,
	< voice: Voice|string, >
	< integer volume, > // percentage, 0 -> 100, default 100
	< integer speed > // percentage, 0 -> 100, default 50
}
```

  * ``` forceEspeak: boolean (default = false) ```
  * ``` defaultVoice: Voice (default = null) ```
  * ``` getTTSSystem(void): string ("sapi"|"espeak") ```
  * ``` setDefaultVoice(Voice): void ```
  * ``` getVoices(void): Promise<resolve<Array<Voice>>|reject<Error>> ```
  * ``` read(Options|string): Promise<resolve<void>|reject<Error>> ```

## Examples

```javascript
const SimpleTTS = require('simpletts');
const tts = new SimpleTTS();

tts.getVoices().then((voices) => {

	console.log(voices[0].name);
	console.log(voices[0].gender);

}).catch((err) => {
	console.log(err);
});

tts.read({ "text": "this is a test", "volume": 75, "speed": 60 }).then(() => {
	console.log('Ok');
}).catch((err) => {
	console.log(err);
});

tts.read("this is a test").then(() => { // is equal to { "text": "this is a test", "voice": voices[0], "volume": 100, "speed": 50 }
	console.log('Ok');
}).catch((err) => {
	console.log(err);
});
```

## Tests

```bash
$ gulp
```

## License

  [ISC](LICENSE)
