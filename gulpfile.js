
"use strict";

// deps

	const path = require("path");

	// gulp
	const gulp = require("gulp");
	const plumber = require("gulp-plumber");

	// tests
	const eslint = require("gulp-eslint");
	const mocha = require("gulp-mocha");

// private

	var _gulpFile = path.join(__dirname, "gulpfile.js");
	var _libDir = path.join(__dirname, "lib");
		var _libFiles = path.join(_libDir, "*.js");
	var _unitTestsFiles = path.join(__dirname, "tests", "*.js");
	var _toTestFiles = [_gulpFile, _libFiles, _unitTestsFiles];

// tasks

	gulp.task("eslint", () => {

		return gulp.src(_toTestFiles)
			.pipe(plumber())
			.pipe(eslint({
				"parserOptions": {
					"ecmaVersion": 6
				},
				"rules": {
					"linebreak-style": 0,
					"quotes": [ 1, "double" ],
					"indent": 0,
					// "indent": [ 2, "tab" ],
					"semi": [ 2, "always" ]
				},
				"env": {
					"node": true, "es6": true, "mocha": true
				},
				"extends": "eslint:recommended"
			}))
			.pipe(eslint.format())
			.pipe(eslint.failAfterError());

	});

	gulp.task("mocha", ["eslint"], () => {

		return gulp.src(_unitTestsFiles)
			.pipe(plumber())
			.pipe(mocha({reporter: "spec"}));

	});

// watcher

	gulp.task("watch", () => {
		gulp.watch(_toTestFiles, ["mocha"]);
	});


// default

	gulp.task("default", ["mocha"]);
	