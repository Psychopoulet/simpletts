
"use strict";

// deps

	const	path = require("path"),

			gulp = require("gulp"),
			eslint = require("gulp-eslint"),
			excludeGitignore = require("gulp-exclude-gitignore"),
			mocha = require("gulp-mocha"),
			plumber = require("gulp-plumber");

// private

	var _gulpFile = path.join(__dirname, "gulpfile.js"),
		_libFiles = path.join(__dirname, "lib", "**", "*.js"),
		_distFiles = path.join(__dirname, "dist", "**", "*.js"),
		_unitTestsFiles = path.join(__dirname, "tests", "**", "*.js"),
		_allJSFiles = [_gulpFile, _libFiles, _distFiles, _unitTestsFiles];

// tasks

	gulp.task("eslint", function () {

		return gulp.src(_allJSFiles)
			.pipe(plumber())
			.pipe(excludeGitignore())
			.pipe(eslint({
				"rules": {
					"indent": 0
				},
				"env": {
					"node": true, "es6": true, "mocha": true
				},
				"extends": "eslint:recommended"
			}))
			.pipe(eslint.format())
			.pipe(eslint.failAfterError());

	});

	gulp.task("mocha", ["eslint"], function () {

		return gulp.src(_unitTestsFiles)
			.pipe(plumber())
			.pipe(mocha({reporter: "spec"}));

	});

// watcher

	gulp.task("watch", function () {
		gulp.watch(_allJSFiles, ["mocha"]);
	});


// default

	gulp.task("default", ["mocha"]);
	