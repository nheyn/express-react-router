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
			if(props.router)		return props.router;
			else if(props.callback)	return this.getRouterFromCallback(props.callback);
			else if(props.src)		return this.getRouterFromSrc(props.src);

			throw new Error("RouterRoute must have 'callback', 'router' or 'src' prop.");
		},
		getRouterFromCallback(callback: ExpressCallback): ExpressRouter {
			let router = express.Router();
			router.use(callback);
			return router;
		},
		getRouterFromSrc(src: string): ExpressRouter {
			return express.static(src);
		}
	},
	propTypes: {
		name: React.PropTypes.string,
		path: React.PropTypes.string,
		src: React.PropTypes.string,
		callback: React.PropTypes.func,
		router: React.PropTypes.any // Because ExpressRouter is a func with props
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