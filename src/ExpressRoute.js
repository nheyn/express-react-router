/**
 * @flow
 */
import React from 'react';
import express from 'express';

/**
 * A React class, that can be use instead of React Router's Route class, that can
 */
const ExpressRoute = React.createClass({
	statics: {
		hasRouter: true,
		getRouter(props: {[key: string]: any}): ExpressRouter {
			if(props.use)				return props.use;
			else if(props.src)	return express.static(props.src);

			throw new Error("RouterRoute must have 'use' or 'src' prop.");
		}
	},
	propTypes: {
		path: React.PropTypes.string,
		src: React.PropTypes.string,
		use: React.PropTypes.any,
	},
	render(): ReactElement {
		throw new Error('RouterRoute should never be rendered');
	}
});
export default ExpressRoute;

/**
 * Check if the given route contains an express router.
 *
 * @param route	The route to check for a router
 *
 * @return			TRUE if the given route contains a router, else FALSE
 */
export function hasExpressRouter(route: ReactRouterRoute): bool {
	return route.type.hasRouter? true: false;
}

/**
 * Gets the express router in the given route.
 *
 * @param route	The route to get the router from
 *
 * @return			The router from the route
 */
export function getExpressRouterFrom(route: ReactRouterRoute): ExpressRouter {
	if(!hasExpressRouter(route)) {
		throw new Error("Routes passed to 'getRouterFrom' must be an EpressRoute.");
	}

	return route.type.getRouter(route.props);
}