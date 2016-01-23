/**
 * @flow
 */
import React from 'react';
import ReactDOMServer from 'react-dom/server';
import express from 'express';
import { match, RouterContext } from 'react-router';

import RouteParser from './RouteParser';
import addPropsToRouter from './addPropsToRouter';

type ServerSettings = {
	routes: ReactRouterRoute,
	props: ?({[key: string]: any} | (req: ExpressReq) => {[key: string]: any}),
	initialLoadHandler: (reactStr: string, req: ExpressReq, res: ExpressRes) => void,
	errorHandler: ?(err: Error, req: ExpressReq, res: ExpressRes) => void,
};

/**
 * Create an express router for the given react-router routes.
 *
 * @param settings			{object}
 *			routes				{ReactRouterRoute}		The router to render
 *			[props]				{Object}				Props to add to the top-level handler
 *			initialLoadHandler	{						A functions that should send the response
 *														to an initial page load request
 *	 								(	string,				The rended html for the current route
 *										ExpressReq,			The express request
 *										ExpressRes			The erpress resonse
 *									) => void
 *								}
 *			[errorHandler]		{						A functions that should send the response
 *														for any error on the server
 *									(	Error,				The error to handle
 *										ExpressReq,			The express request
 *										ExpressRes			The erpress resonse
 *									) => void
 *								}
 *
 * @return					{ExpressRouter}				The express router to add to the express
 *														application
 */
export default function createExpressRouter(settings: ServerSettings): ExpressRouter {
	// Get route
	if(!settings.routes) throw new Error('Route is required for the server');
	const routerParser = new RouteParser(settings.routes);
	const routes = routerParser.getReactRouterRoute();
	const expressRouterFromRoute = routerParser.getExpressRouter();

	// Get request handlers
	const initialLoadHandler = settings.initialLoadHandler;
	if(!initialLoadHandler) throw new Error('The initialLoadHandler is required for the server');

	const errorHandler = settings.errorHandler? settings.errorHandler: defaultErrorHandler;

	if(typeof initialLoadHandler !== 'function' || typeof errorHandler !== 'function') {
		throw new Error('The initialLoadHandler / errorHandler must be a function');
	}

	// Create express router
	let router = express.Router();
	router.use((req, res, next) => {
		// Render current route
		const location = req.url;
		match({ routes, location }, (err, redirectLocation, renderProps) => {
			if(err) {
				// Handle errors in route
				next(err);
			}
			else if(redirectLocation) {
				// Handle redirect
				res.redirect(302, redirectLocation.pathname + redirectLocation.search)
			}
			else if(renderProps) {
				let routerContextElement = <RouterContext {...renderProps} />;

				// Add props
				if(settings.props) {
					const props = typeof settings.props === 'function'?
									settings.props(req):
									settings.props;

					routerContextElement = addPropsToRouter(routerContextElement, props);
				}

				// Render react-router handler
				const renderedReactHtml = ReactDOMServer.renderToString(routerContextElement);

				// Send to client
				initialLoadHandler(renderedReactHtml, req, res);
			}
			else {
				next();
			}
		});
	});
	router.use(expressRouterFromRoute);
	router.use((req, res) => {
		// Send basic 404 message
		res.status(404).send({
			errorName: '404',
			errorMessage: `Page Not Found: ${req.url}`
		});
	});
	router.use((err, req, res, next) => {
		errorHandler(err, req, res);
	});

	return router;
}

/*------------------------------------------------------------------------------------------------*/
//	--- Helper functions ---
/*------------------------------------------------------------------------------------------------*/
function defaultErrorHandler(err: Error, req: ExpressReq, res: ExpressRes) {
	 res.status(500).send({ errorName: err.name, errorMessage: err.message });
}
