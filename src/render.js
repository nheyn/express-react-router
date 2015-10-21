/**
 * @flow
 */
const ReactDOM = require('react-dom');
const React = require('react');

const RouteParser = require('./RouteParser');
const addPropsToRouter = require('./addPropsToRouter');

type ClientSettings = {
	routes: ReactRouterRoute,
	container: any, //NOTE, 'any' is in lib/react.js but is really a DOMElement,
	callback: ?Function
};

/**
 * Render the given routes to the given container.
 *
 * @param settings	{Object}
 *			routes		{ReactRouterRoute}	The router to render
 *			container	{DOMElement}		Same as second argument to 'ReactDOM.render'
 *			[callback]	{() => void}		Same as thrid argument to 'ReactDOM.render'
 *
 * @return			{ReactComponent}		The render componet (see return of 'React.render')
 */
function render(settings: ClientSettings): ReactComponent<any, any, any> {
	// Get route
	if(!settings.routes) throw new Error('Route is required to render');
	const routerParser = new RouteParser(settings.routes);
	const parsedRoutes = routerParser.getReactRouterRoute();

	// Add props
	const routes = settings.props? addPropsToRouter(parsedRoutes, settings.props): parsedRoutes;

	// Get container
	if(!settings.container) throw new Error('A container is required to render');
	const container = settings.container;

	// Render routes to given container
	return settings.callback?
			ReactDOM.render(routes, container, settings.callback):
			ReactDOM.render(routes, container);
}

/*------------------------------------------------------------------------------------------------*/
//	--- Exports ---
/*------------------------------------------------------------------------------------------------*/
module.exports = render;
