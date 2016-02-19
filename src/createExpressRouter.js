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
	PageComponent: ReactClass,
	props?: {[key: string]: any},
	getProps?: (req: ExpressReq) => {[key: string]: any},
};

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
export default function createExpressRouter(settings: ServerSettings): ExpressRouter {
	// Get route
	if(!settings.routes) throw new Error('Route is required for the server');
	const routerParser = new RouteParser(settings.routes);
	const routes = routerParser.getReactRouterRoute();
	const expressRouterFromRoute = routerParser.getExpressRouter();

	// Get PageComponent
	const { PageComponent } = settings;
	if(!PageComponent) throw new Error('PageComponent is required for the server');

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
				if(settings.props || settings.getProps) {
					const staticProps = settings.props? settings.props: {}
					const propsForReq = settings.getProps? settings.getProps(req): {};

					routerContextElement = addPropsToRouter(routerContextElement, { ...staticProps, ...propsForReq });
				}

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
