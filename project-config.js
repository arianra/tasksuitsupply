"use strict";
let path = require('path'),
	fs = require('fs'),
	packageJSON = JSON.parse(fs.readFileSync('./package.json'))

const
	VERSION = packageJSON.version,
	NAME = packageJSON.name,

	ROOT = path.normalize(__dirname),
	SERVER = path.join(ROOT, 'server'),
	DIST = path.join(ROOT, 'dist'),
	SRC = path.join(ROOT, 'src'),
	THEME = path.join(SRC, 'theme');

const BANNER =
`
/*!
 *  Project: ${NAME}
 *  Version: ${VERSION}
 */

`

module.exports = {
	version: VERSION,
	name: NAME,
	banner: BANNER,
	paths: {
		src: SRC,
		dist: DIST,
		server: SERVER,
		
		core: path.join(SRC, 'core'),
		theme: {
			content: path.join(THEME, 'content'),
			style: path.join(THEME, 'style'),
			views: path.join(THEME, 'views')
		}

	},
	files: {
		server: path.join(SERVER, 'server.js'),
		data: path.join(SERVER, 'data.json'),
	},
	settings: {
		server: {
			port: 3000
		}
	}
};