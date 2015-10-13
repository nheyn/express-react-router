/**
 * @flow
 */
const React = require('react');

const RouteParser = require('./RouteParser');

type ClientSettings = {
	routes: ReactRouterRoute,
	props: ?{[key: string]: any},
	container: any, //NOTE, 'any' is in lib/react.js but is really a DOMElement,
	callback: ?Function
};

/**
 * Render the given routes to the given container.
 *
 * @param settings	{Object}
 *			routes		{ReactRouterRoute}	The router to render
 *			[props]		{Object}			Props to add to the top-level handler
 *			container	{DOMElement}		Same as second argument to 'React.render'
 *			[callback]	{() => void}		Same as thrid argument to 'React.render'
 *
 * @return			{ReactComponent}		The render componet (see return of 'React.render')
 */
function render(settings: ClientSettings): ReactComponent<any, any, any> {
	// Get route
	if(!settings.routes) throw new Error('Route is required to render');
	const routerParser = new RouteParser(settings.routes);
	const routes = settings.props?
					React.cloneElement(routerParser.getReactRouterRoute(), settings.props):
					routerParser.getReactRouterRoute();

	// Get container
	if(!settings.container) throw new Error('A container is required to render');
	const container = settings.container;

	// Render routes to given container
	return settings.callback?
			React.render(routes, container, settings.callback):
			React.render(routes, container);
}

/*------------------------------------------------------------------------------------------------*/
//	--- Exports ---
/*------------------------------------------------------------------------------------------------*/
module.exports = render;
