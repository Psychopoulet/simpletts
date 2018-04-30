
"use strict";

// deps

	const path = require("path");

	// gulp
	const gulp = require("gulp");
	const plumber = require("gulp-plumber");

	// tests
	const eslint = require("gulp-eslint");
	const mocha = require("gulp-mocha");

	// reports
	const istanbul = require("gulp-istanbul");
	const coveralls = require("gulp-coveralls");

// consts

	const ISTRAVIS = (0, process).env.TRAVIS || false;

	const APP_FILES = [ path.join(__dirname, "lib", "**", "*.js") ];
	const UNITTESTS_FILES = [ path.join(__dirname, "tests", "**", "*.js") ];

	const ALL_FILES = [ path.join(__dirname, "gulpfile.js") ]
		.concat(APP_FILES)
		.concat(UNITTESTS_FILES);

// tasks

	gulp.task("eslint", () => {

		return gulp.src(ALL_FILES)
			.pipe(plumber())
			.pipe(eslint({
				"env": require(path.join(__dirname, "gulpfile", "eslint", "env.json")),
				"globals": require(path.join(__dirname, "gulpfile", "eslint", "globals.json")),
				"parserOptions": {
					"ecmaVersion": 6
				},
				// http://eslint.org/docs/rules/
				"rules": require(path.join(__dirname, "gulpfile", "eslint", "rules.json"))
			}))
			.pipe(eslint.format())
			.pipe(eslint.failAfterError());

	});

	gulp.task("istanbul", gulp.series("eslint", () => {

		return gulp.src(APP_FILES)
			.pipe(plumber())
			.pipe(istanbul({ "includeUntested": true }))
			.pipe(istanbul.hookRequire());

	}));

	gulp.task("mocha", gulp.series("istanbul", () => {

		return gulp.src(UNITTESTS_FILES)
			.pipe(plumber())
			.pipe(mocha())
			.pipe(istanbul.writeReports())
			.pipe(istanbul.enforceThresholds({ "thresholds": { "global": 85 } }));

	}));

	gulp.task("coveralls", gulp.series("mocha", () => {

		return gulp.src(path.join(__dirname, "coverage", "lcov.info"))
			.pipe(plumber())
			.pipe(coveralls());

	}));

	gulp.task("tests", gulp.series(ISTRAVIS ? "coveralls" : "mocha"));

// watcher

	gulp.task("watch", () => {
		gulp.watch(ALL_FILES, [ "eslint" ]);
	});


// default

	gulp.task("default", gulp.series("mocha"));
