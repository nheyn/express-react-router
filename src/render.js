/**
 * @flow
 */
import React from 'react';
import ReactDOM from 'react-dom';

import RouteParser from './RouteParser';
import addPropsToRouter from './addPropsToRouter';

type PropArgs = Object | () => Object;

/**
 * Render the given routes to the given container.
 *
 * @param routes			{ReactRouterRoute}		The router to render
 * @param container			{DOMElement}			Same as second argument to 'ReactDOM.render'
 * @param ...propArgs		{Array<Object | Func>}	All arguments after routes is used to add props to the top-level
 *													components in the router. If given as a function, it will be called
 *													when the component is rendered or updated.
 *
 * @return					{ReactComponent}		The render componet (see return of 'React.render')
 */
export default function render(
	routes: ReactRouterRoute,
	container: any, 				//NOTE, 'any' is in lib/react.js but is really a DOMElement
	...propArgs: Array<PropArgs>
): ReactComponent {
	// Check args
	if(!routes) throw new Error('Route is required to render');
	if(!container) throw new Error('A container is required to render');

	// Parse routes
	const routerParser = new RouteParser(routes);
	const parsedRoutes = routerParser.getReactRouterRoute();

	// Render current route
	if(!propArgs || propArgs.length === 0) {
		return ReactDOM.render(parsedRoutes, container);
	}
	else {
		return renderWithProps(parsedRoutes, container, () => {
			let props = {};
			propArgs.forEach((propArg) => {
				const newProps = typeof propArg === 'function'? propArg(): propArg;

				props = { ...props, ...newProps };
			});
			return props;
		});
	}
}

function renderWithProps(routes: ReactRouterRoute, container: any, getProps: () => Object): ReactComponent {
	const props = getProps();
	const routesWithProps = addPropsToRouter(routes, null, getProps);

	let hasRenderedBefore = false;
	return ReactDOM.render(routesWithProps, container, () => {
		console.log({ hasRenderedBefore, props: getProps() });
		if(hasRenderedBefore)	renderWithProps(routes, container, getProps);
		else					hasRenderedBefore = true;
	});
}
