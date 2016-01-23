var express = require('express');
var { createExpressRouter } = require('express-react-router');
var routes = require('./routes');

// Request handlers
function initialLoadHandler(reactHtmlString, req, res) {
	// Create html for the full page
	var pageHtml =
`
<html>
	<head>
		<title>Example Page</title>
	</head>
	<body>
		<div id="reactContent">${reactHtmlString}</div>
		<script src="/app.js"></script>
	</body>
</html>
`;

	// Send to Client
	res.send(pageHtml);
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
	res.status(500).send(pageHtml);
}

// Create Server
var reactRouter = createExpressRouter({
	routes: routes,
	initialLoadHandler: initialLoadHandler,
	errorHandler: errorHandler
});

var app = express();
app.use(reactRouter);

// Start Server
app.listen(80);
