var fs = require('fs');
var browserify = require('browserify');

var ignore = [
	'express',
	'babel-cli',
	'babel-preset-es2015',
	'babel-preset-stage-0',
	'babel-preset-react',
	'browserify'
];

// Browserify client side app
var b = browserify('./lib/client.js');
ignore.forEach(function(module) {
	b.ignore(module);
});

// Write file
var appJsWriteStream = fs.createWriteStream('app.js', { flags : 'w' });
var appJsBundle = b.bundle();

appJsBundle.pipe(appJsWriteStream);
