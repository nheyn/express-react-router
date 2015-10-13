/**
 * @flow
 */
const React = require('react');

type ClientSettings = {
	routes: ReactRouterRoute,
	props: ?{[key: string]: any},
	container: any, //NOTE, 'any' is in lib/react.js but is really a DOMElement,
	callback: ?Function
};

/**
 * //TODO
 */
function render(settings: ClientSettings): ReactComponent<any, any, any> {
	//TODO
}

/*------------------------------------------------------------------------------------------------*/
//	--- Exports ---
/*------------------------------------------------------------------------------------------------*/
module.exports = render;
