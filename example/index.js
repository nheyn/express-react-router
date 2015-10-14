var fs = require('fs');
var browserify = require('browserify');

// Browserify client side app
var b = browserify('./lib/client.js');

//NOTE, ignore any npm modules that should not be sent to the client
b.ignore('express');

// Write file
var appBundle = b.bundle();

console.log('browserify(start):  lib/client.js -> app.js');
appBundle.pipe(
	fs.createWriteStream('app.js', { flags : 'w' })
);
appBundle.on('end', function() {
	console.log('browserify(finish): lib/client.js -> app.js');
});

// Start Server
console.log('starting server: using lib/server.js');
require('./lib/server');
