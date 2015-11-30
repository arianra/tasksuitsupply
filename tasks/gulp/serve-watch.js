"use strict";
let gulp = require('gulp'),
	path = require('path'),
	server = require('gulp-express'),
	util = require('gulp-util'),
	chalk = require('chalk'),
	config = require('../../project-config')

const
	CONTENT = config.paths.theme.content,
	VIEWS = config.paths.theme.views,
	STYLE = config.paths.theme.style,
	CORE = config.paths.core,
	DIST = config.paths.dist

module.exports = {
	dependencies: [],
	aliases: ['watch'],
	task: function(){				
		 gulp.watch([
		 	path.join(CORE, '**/', '*.ts')
		 ], ['build-bundle'])
		
		 gulp.watch([
			 path.join(VIEWS, '**/' ,'*.*')
		 ], ['build-views'])
		 
		 gulp.watch([
			 path.join(STYLE, '**/', '*.scss' )
		 ],['build-stylesheet'])
		 
		//watch distribution files and notify server
		gulp.watch([
			path.join(DIST, 'content', '**/' , '*.*'),
			path.join(DIST, 'scripts', '*.js'),
			path.join(DIST, 'stylesheets', '*.css'),
			path.join(DIST, 'views', '**/' ,'*.html')
		], function(event){
			util.log(			
				`${chalk.cyan(event.type)} ${path.extname(event.path).slice(1)} ${chalk.gray(`(${path.relative(DIST, event.path)})`)}`
			)
			
			server.notify(event)
		})
	}
}