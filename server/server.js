"use strict";
let path = require('path'),
	express = require('express'),
	livereload = require('connect-livereload'),
	config = require('../project-config.js')

const
	DIST = config.paths.dist,
	VIEWS = config.paths.theme.views,
	DATA = config.files.data,
	PORT = config.settings.server.port

module.exports.app = App()

function App() {
	let app = express()

	return init()

	function init() {
		app.use(livereload())
		app.use(express.static(DIST))
		app.use('/', express.static(VIEWS))
		app.use('/data.json', express.static(DATA))
		
		app.listen(PORT)

		return app
	}
}