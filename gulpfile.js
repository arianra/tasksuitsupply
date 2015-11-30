"use strict";
let gulp = require('gulp'),
	glob = require('glob'),
	path = require('path');

//
// @description : read in all files from gulp/tasks and create tasks for them
//
// **note: task names are based on the filename (without extension)**
// **note2: when aliases are supplied, the given task is registered as a dependency, 
//			this way gulp will output the original task name**
//
glob.sync('./tasks/gulp/{,*/}*.js').forEach((file) => {
	let content = require(file),
		taskName = path.basename(file, path.extname(file))

	gulp.task(taskName, content.dependencies, content.task)

	if (content.aliases) {
		content.aliases.forEach((alias) => {
			gulp.task(alias, [taskName])
		})
	}
});