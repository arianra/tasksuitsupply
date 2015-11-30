// We only have a very simple view in this project, no need to process it
"use strict";

let gulp = require('gulp'),
	path = require('path'),
	config = require('../../project-config');
	
const 
	VIEWS = config.paths.theme.views,
	DIST = config.paths.dist;

module.exports = {
	dependencies: [],
	aliases: ['views', 'html'],
	task: function(){
		return gulp.src([
			path.join(VIEWS, '**/', '*.*'),
		])
		.pipe(
			gulp.dest(
				path.join(DIST, 'views')
			)
		)
	}
}