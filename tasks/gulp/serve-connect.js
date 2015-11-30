"use strict";
let gulp = require('gulp'),
	path = require('path'),
	express = require('gulp-express'),
	config = require('../../project-config');

const SERVER_APP = config.files.server;

module.exports = {
	dependencies: [],
	aliases: ['server'],
	task: function(){
		express.run([SERVER_APP]);
	}
}