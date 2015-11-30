"use strict";
let gulp = require('gulp'),
	path = require('path'),
	concat = require('gulp-concat'),
	insert = require('gulp-insert'),
	sass = require('gulp-sass'),
	sourcemaps = require('gulp-sourcemaps'),
	config = require('../../project-config');

const
	STYLE = config.paths.theme.style,
	DIST = config.paths.dist;

module.exports = {
	dependencies: [],
	aliases: ['sass', 'style'],
	task: function () {
		return gulp.src([
				path.join(STYLE, '*.scss')
			])
			.pipe(
				sourcemaps.init()
			)
			.pipe(
				sass({
					errLogToConsole: true
				})
				.on('error', sass.logError)
			)
			.pipe(
				concat('theme.css')
			)
			.pipe(
				sourcemaps.write()
			)
			.pipe(
				insert.prepend(config.banner)
			)
			.pipe(
				gulp.dest(
					path.join(DIST, 'stylesheets')
				)
			);
	}
}