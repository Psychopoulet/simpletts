# simpletss
A basic tss manager, based on Microsoft Speech API or espeak for others OS

## Installation

```bash
$ npm install simpletss
```

## Features

  * simply read & play text

## Examples

```js

const SimpleTTS = require('simpletts');

console.log(SimpleTTS.getTTSSystem()); // 'SAPI' or 'espeak'

SimpleTTS.getVoices().then(function(voices) {

	console.log(voices); // depend of the TTS system used

	SimpleTTS.read({
		text: "ceci est un test",
		voice: voices[0], // optionnal, object or text, default first language detected
		volume: 100, // optionnal, percentage, 0 -> 100, default 100
		speed: 50 // optionnal, percentage, 0 -> 100, default 50
	}).then(function() {

		console.log('Ok');
		
	}).catch(function(err) {

		console.log(err);
		
	});

	SimpleTTS.read("ceci est un test").then(function() {
		// is equal to { text: "ceci est un test", voice: voices[0], volume: 100, speed: 50 }

		console.log('Ok');
		
	}).catch(function(err) {

		console.log(err);
		
	});

	// the default language can be changed like that :
	SimpleTTS.setDefaultVoice(voices[1]);

}).catch(function(err) {
	console.log(err);
});

```

## Tests

```bash
$ node tests/tests.js
```

## License

  [ISC](LICENSE)
