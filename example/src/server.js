var express = require('express');
var { createExpressRouter } = require('express-react-router');
var routes = require('./routes');

// Request handlers
function responseHandler(reactHtmlString, req, res) {
	// Create html for the full page
	var pageHtml =
`
<html>
	<head>
		<title>Example Page</title>
	</head>
	<body>
		<div id="reactContent">${reactHtmlString}</div>
		<script src="app.js"><script />
	</body>
</html>
`;

	// Send to Client
	req.send(pageHtml);
}

function errorHandler(err, req, res) {
	// Create html for error
	var pageHtml =
`
<html>
	<head>
		<title>Example Error Page</title>
	</head>
	<body>
		<div id="error"
			<h1>Error<h1>
			<h3>${err.name}</h3>
			<p>
				${err.message}
			</p>
		</div>
	</body>
</html>
`;

	// Send to Client
	req.status(500).send(pageHtml);
}

// Create Server
var app = express();
app.use(createExpressRouter({
	routes: routes,
	responseHandler: responseHandler,
	errorHandler: errorHandler
}));

// Start Server
app.listen(80);
