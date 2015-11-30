"use strict";
let gulp = require('gulp'),
	path = require('path'),
	config = require('../../project-config.js'),
	chalk = require('chalk'),
	util = require('gulp-util'),
	Builder = require('systemjs-builder');

module.exports = {
	dependencies: [],
	aliases: ['bundle', 'js'],
	task: function () {
		var builder = new Builder('.', 'systemjs-config.core.js');
		
		builder
			.buildStatic(
				'src/core/core',
				'dist/scripts/main.js'
				)
			.then(function (output) {
				util.log(chalk.bold('Bundled the following modules:'))
				output.modules.sort().forEach(function (value, index) {
					util.log(chalk.cyan(index), '\t', value)
				});
			})
			.catch(function (e) {
				console.log(new Error(e));
			})

	}
}