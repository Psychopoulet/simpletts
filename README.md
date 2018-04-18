# simpletss
A basic tss manager, based on Microsoft Speech API or espeak for others OS

[![Build Status](https://api.travis-ci.org/Psychopoulet/simpletss.svg?branch=master)](https://travis-ci.org/Psychopoulet/simpletss)
[![Coverage Status](https://coveralls.io/repos/github/Psychopoulet/simpletss/badge.svg?branch=master)](https://coveralls.io/github/Psychopoulet/simpletss)
[![Dependency Status](https://img.shields.io/david/Psychopoulet/simpletss/master.svg)](https://github.com/Psychopoulet/simpletss)

## Installation

```bash
$ npm install simpletss
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

  * ``` static getTTSSystem() : return string ``` 'sapi' or 'espeak'
  * ``` static setDefaultVoice(object) : return void ```
  * ``` static getVoices() : return Promise instance ```

```javascript
// voice :
{ string name, string gender }
```

  * ``` static read(string) : return Promise instance ```
  * ``` static read(object options) : return Promise instance ```

```javascript
// options :
{
	string text,
	object voice | string voiceName, // optionnal, default first language detected
	integer volume, // optionnal, percentage, 0 -> 100, default 100
	integer speed // optionnal, percentage, 0 -> 100, default 50
}
```

## Examples

```javascript
const simpletts = require('simpletts');

simpletts.getVoices().then((voices) => {

	console.log(voices[0].name);
	console.log(voices[0].gender);

}).catch((err) => {
	console.log(err);
});

simpletts.read({ text: "this is a test", volume: 75, speed: 60 }).then(() => {
	console.log('Ok');
}).catch((err) => {
	console.log(err);
});

simpletts.read("this is a test").then(() => { // is equal to { text: "this is a test", voice: voices[0], volume: 100, speed: 50 }
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
