/**
 * @flow
 */
import path from 'path';
import express from 'express';
import React from 'react';

/**
 * A class that parse the react router routes, that also contains express http handlers.
 */
export default class RouteParser {
	_router: ReactRouterRoute;

	/**
	 * A constructor that takes the route that is being parsed.
	 *
	 * @param route	{ReactRouterRoute}	The route to parse
	 *							NOTE:	React routes can have http sub-routes, but http routes can
	 *									not have React sub-routes
	 */
	constructor(route: ReactRouterRoute) {
		this._router = route;
	}

	/**
	 * Gets the react router route without any of the http handler routes.
	 *
	 * @return	{ReactRouterRoute}	The route with out http handlers
	 */
	getReactRouterRoute(): ReactRouterRoute {
		return filterChildren(this._router, doesntHaveExpressRouter);
	}

	/**
	 * Gets the express router defined in the react router Route.
	 *
	 * @return	{ExpressRouter}		The router that handles all non page load requests
	 */
	getExpressRouter(): ExpressRouter {
		let router = express.Router();
		forEachRoute(this._router, (route, path) => {
			if(hasExpressRouter(route)) router.use(path, getRouterFrom(route));
		});
		return router;
	}
}

/**
 * Get the given route with its children filtered using the given function.
 *
 * NOTE: Does not call render for each element, only get children from el.props.children
 * NOTE: The given route is not sent to the checkFn
 *
 * @param route   The react-router <Route /> to filter the children of
 * @param checkFn The function to check weather or not to keep the child
 *
 * @return        The react-router <Route /> without the filtered out children
 */
export function filterChildren(route: ReactRouterRoute, checkFn: (route: ReactRouterRoute) => bool): ReactRouterRoute {
  const { children } = route.props;
  if(!children) return route;

  return React.cloneElement(
  	route,
  	{},
  	React.Children.toArray(children)
  		.filter(checkFn)
  		.map((child) => filterChildren(child, checkFn))
  );
}

/**
 * Call the given callback for each element in the given react-router <Route />.
 *
 * NOTE: Does not call render for each element, only get children from el.props.children
 *
 * @param route     	The react-router <Route /> to traverse
 * @param mapFn     	The function to call with each route, and its current path in the router
 * @param [currPath]  The path of the given route
 */
export function forEachRoute(
	route: ReactRouterRoute,
	mapFn: (el: ReactRouterRoute,	path: string) => void,
	currPath: string = ''
) {
  mapFn(route, currPath);

  React.Children.forEach(route.props.children, (child) => {
     const nextPath = child.props.path? path.join(currPath, child.props.path): currPath;

     forEachRoute(child, mapFn, nextPath);
  });
}

// Helper Functions
function hasExpressRouter(route: ReactRouterRoute): bool {
	return route.type.hasRouter? true: false;
}

function doesntHaveExpressRouter(route: ReactRouterRoute): bool {
	return !hasExpressRouter(route);
}

function getRouterFrom(route: ReactRouterRoute): ExpressRouter {
	if(doesntHaveExpressRouter(route)) {
		throw new Error("Routes passed to 'getRouterFrom' must have 'getRouter'.");
	}

	return route.type.getRouter(route.props);
}
