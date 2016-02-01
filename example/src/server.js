import express from 'express';
import { createExpressRouter } from 'express-react-router';

import routes from './routes';

// Request handlers
function initialLoadHandler(reactHtmlString, req, res) {
	// Create html for the full page
	const pageHtml =
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
	const pageHtml =
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
const reactRouter = createExpressRouter({
	routes: routes,
	initialLoadHandler: initialLoadHandler,
	errorHandler: errorHandler
});

let app = express();
app.use((req, res, next) => {
	const { url, method, params, query } = req;
	console.log(`[${url}]: `, { method, params, query });
	next();
});
app.use(reactRouter);

// Start Server
app.listen(8080);
console.log('listening on port 8080');
