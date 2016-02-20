import React from 'react';
import ReactDOMServer from 'react-dom/server';
import express from 'express';
import { handleReactRouter } from 'express-react-router';

import routes from './routes';

const Page = React.createClass({
	getUrl() {
		return this.props.req.url;
	},
	getInnerHTML() {
		return { __html: this.props.reactHtml };
	},
	render() {
		return (
			<html>
				<head>
					<title>Example Page - {this.getUrl()}</title>
				</head>
				<body>
					<div id="reactContent" dangerouslySetInnerHTML={this.getInnerHTML()} />
					<script src="/app.js"></script>
				</body>
			</html>
		);
	}
});

const ErrorPage = React.createClass({
	render() {
		const { err } = this.props;
		return (
			<html>
				<head>
					<title>Example Error Page</title>
				</head>
				<body>
					<div id="error">
						<h1>Error</h1>
						<h3>{err.name}</h3>
						<p>
							{err.message}
						</p>
					</div>
				</body>
			</html>
		);
	}
});

// Create Server
let app = express();
app.use((req, res, next) => {
	const { url, method, params, query } = req;
	console.log(`[${url}]: `, { method, params, query });
	next();
});
app.use(handleReactRouter(routes, Page, { title: 'Express React Router Example Site' }, (req) => {
	return { url: req.url };
}));
app.use((err, req, res, next) => {
	// Send to Client
	res.status(500).send(
		'<!DOCTYPE html>' +
		ReactDOMServer.renderToStaticMarkup(<ErrorPage err={err} />)
	);
});

// Start Server
app.listen(8080);
console.log('listening on port 8080');
