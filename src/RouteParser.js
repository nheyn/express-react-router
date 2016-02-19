/**
 * @flow
 */
import path from 'path';
import express from 'express';
import React from 'react';

type RouteFilter = (route: ReactRouterRoute) => bool;

/**
 * A class that parse the react router routes, that also contains express http handlers.
 */
export default class RouteParser {
	_route: ReactRouterRoute;

	/**
	 * A constructor that takes the route that is being parsed.
	 *
	 * @param route	{ReactRouterRoute}	The route to parse
	 *							NOTE:	React routes can have http sub-routes, but http routes can
	 *									not have React sub-routes
	 */
	constructor(route: ReactRouterRoute) {
		this._route = route;
	}

	/**
	 * Gets the react router route without any of the http handler routes.
	 *
	 * @return	{ReactRouterRoute}	The route with out http handlers
	 */
	getReactRouterRoute(): ReactRouterRoute {
		return React.cloneElement(
			this._route,
			{},
			this._getReactRouterRoutesChildren()
		);
	}

	/**
	 * Gets the express router defined in the react router Route.
	 *
	 * @return	{ExpressRouter}		The router that handles all non page load requests
	 */
	getExpressRouter(): ExpressRouter {
		let router = express.Router();
		this._getExpressRouterRoutes().forEach((route) => {
			router.use(getPathOf(route), getRouterFrom(route));
		});
		return router;
	}

	_getExpressRouterRoutes(): Array<ReactRouterRoute> {
		return this._flattenAndFilteredChildren(hasExpressRouterRecursive).filter(hasExpressRouter);
	}

	_getReactRouterRoutesChildren(): Array<ReactRouterRoute> {
		return this._filterRoutesChildren(doesntHaveExpressRouter);
	}

	_filterRoutesChildren(shouldKeep: RouteFilter): Array<ReactRouterRoute> {
		return filterChildren(this._route.props.children, shouldKeep);
	}

	_flattenAndFilteredChildren(shouldKeep: RouteFilter) : Array<ReactRouterRoute> {
		return flattenRoutes(
			getPathOf(this._route),
			this._filterRoutesChildren(shouldKeep)
		);
	}
}

// Helper Functions
function hasExpressRouter(route: ReactRouterRoute): bool {
	return route.type.hasRouter? true: false;
}

function doesntHaveExpressRouter(route: ReactRouterRoute): bool {
	return !hasExpressRouter(route);
}

function hasExpressRouterRecursive(route: ReactRouterRoute): bool {
	if(hasExpressRouter(route)) return true;
	if(!route.props.children) return false;

	// Check if any child has router
	const numberOfChildrenWithRouter = filterChildren(
		route.props.children,
		hasExpressRouterRecursive
	).length;
	return numberOfChildrenWithRouter > 0;
}

function filterChildren(
	children: ?(ReactRouterRoute | Array<ReactRouterRoute>),
	shouldKeep: RouteFilter
): Array<ReactRouterRoute> {
	let filteredChildren = [];
	React.Children.forEach(children, (child, i) => {
		// Don't include null children
		if(!child) return;

		// Filter children and their children by should keep
		if(shouldKeep(child)) {
			filteredChildren.push(
				React.cloneElement(
					child,
					{key: i},
					child.props.children?
						filterChildren(child.props.children, shouldKeep):
						null
				)
			);
		}
	});
	return filteredChildren;
}

function flattenRoutes(
	startPath: string,
	routes: Array<ReactRouterRoute>
): Array<ReactRouterRoute> {
	if(routes.length === 0) return [];

	let flattenedRoutes = [];
	const flattener = (currRoutes, prefix) => {
		//NOTE, Not using React.Children.map because github.com/facebook/react/issues/2872
		React.Children.forEach(currRoutes, (route) => {
			const currPath = getPathOf(route, prefix);

			flattenedRoutes.push(React.cloneElement(route, { path: currPath }));
			if(route.props.children) flattener(route.props.children, currPath);
		});
	};
	flattener(routes, startPath);

	return flattenedRoutes;
}

function getPathOf(route: ReactRouterRoute, prefix?: string): string {
	return path.join(
		prefix? prefix: '/',
		route.props.path? route.props.path: (route.props.name? route.props.name: '')
	);
}

function getRouterFrom(route: ReactRouterRoute): ExpressRouter {
	if(doesntHaveExpressRouter(route)) {
		throw new Error("Routes passed to 'getRouterFrom' must have 'getRouter'.");
	}

	return route.type.getRouter(route.props);
}
