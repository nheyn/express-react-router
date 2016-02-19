/**
 * @flow
 */
import React from 'react';
import ReactDOMServer from 'react-dom/server';
import express from 'express';
import { match, RouterContext } from 'react-router';

import RouteParser from './RouteParser';
import addPropsToRouter from './addPropsToRouter';

type PropArg = Object | (req: ExpressReq) => Object;

/**
 * Create an express router for the given react-router routes.
 *
 * @param settings			{object}
 *			routes				{ReactRouterRoute}		The router to render
 *			PageComponent		{ReactClass}			A class that takes the render html string, reactHtml, and a
 *														express request, req, as a prop and returns markup for the
 *														entire page.
 *														NOTE: This is render using 'renderToStaticMarkdown(...)' with
 *														'' placed before it.
 *			[props]				{Object}				Props to add to the top-level handler
 *			[getProps]			{ExpressReq => Object}	A function the gets props to add to the top-level handler, for
 *														the given request
 *
 * @return					{ExpressRouter}				The express router to add to the express
 *														application
 */
export default function createExpressRouter(
	routes: ReactRouterRoute,
	PageComponent: ReactClass,
	...propArgs: Array<PropArg>
): ExpressRouter {
	// Check args route
	if(!routes) throw new Error('Route is required for the server');
	if(!PageComponent) throw new Error('PageComponent is required for the server');

	// Parse Routes
	const routerParser = new RouteParser(routes);
	const reactRouterRoutes = routerParser.getReactRouterRoute();
	const expressRouterFromRoute = routerParser.getExpressRouter();

	// Combine props
	const getAllProps = (req) => {
		let currProps = {};
		// $FlowIssue - Not able to figure out forEach / union types
		propArgs.forEach((nextProps) => {
			// $FlowIssue - Not able to figure out ternary operator / union types
			const newProps = nextProps === 'function'? nextProps(req): nextProps;
			currProps = { ...currProps, ...newProps };
		});
		return currProps;
	};

	// Create express router
	let router = express.Router();
	router.use((req, res, next) => {
		// Render current route
		match({ routes: reactRouterRoutes, location: req.url }, (err, redirectLocation, renderProps) => {
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
				if(propArgs.length) routerContextElement = addPropsToRouter(routerContextElement, getAllProps());

				// Render react-router handler
				const renderedReactHtml = ReactDOMServer.renderToString(routerContextElement);

				// Send entire page to client
				res.send(
					'<!DOCTYPE html>' +
					ReactDOMServer.renderToStaticMarkup(<PageComponent req={req} reactHtml={renderedReactHtml} />)
				);
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

	return router;
}
