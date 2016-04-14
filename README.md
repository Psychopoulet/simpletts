# simpletss
A basic tss manager, based on Microsoft Speech API or espeak for others OS

## Installation

```bash
$ npm install simpletss
```

## Note

There is absolutly no option at this moment.
Coming soon.

## Features

  * simply read & play text

## Examples

```js

const SimpleTTS = require('simpletts');

SimpleTTS.getVoices().then(function(voices) {

	console.log(voices); // depend of the TTS system used

}).catch(function(err) {
	console.log(err);
});

SimpleTTS.read("ceci est un test").then(function() { // more options will be implemented soon

	console.log('Ok');
	
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
