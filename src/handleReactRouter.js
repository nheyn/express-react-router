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
 * @param PageComponent		{ReactClass}			A class that takes the render html string, reactHtml, and a
 *													express request, req, as a prop and returns markup for the
 *													entire page.
 *													NOTE: This is render using 'renderToStaticMarkdown(...)' with
 *													'<!DOCTYPE html>' placed before it.
 * @param routes			{ReactRouterRoute}		The router to render
 * @param ...propArgs		{Array<Object | Func>}	All arguments after routes is used to add props to the top-level
 *													components in the router
 *
 * @return					{ExpressRouter}			The express router to add to the express application
 */
export default function handleReactRouter(
	PageComponent: ReactClass,
	routes: ReactRouterRoute,
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
		console.log({ propArgs });
		propArgs.forEach((nextProps) => {
			const newProps = typeof nextProps === 'function'? nextProps(req): nextProps;

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
				if(propArgs.length) routerContextElement = addPropsToRouter(routerContextElement, getAllProps(req));

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
