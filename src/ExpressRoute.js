/**
 * @flow
 */
import React from 'react';
import express from 'express';

/*------------------------------------------------------------------------------------------------*/
//	--- Express Route Handler Definitions ---
/*------------------------------------------------------------------------------------------------*/
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
