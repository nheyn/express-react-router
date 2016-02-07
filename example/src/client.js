import 'babel-polyfill';

import React from 'react';
import { render } from 'express-react-router';

import routes from './routes';

// Turn on React Dev tools
window.React = React;

// Render react-router to page
render({
	routes: routes,
	props: { title: 'Express React Router Example Site' },
	getProps(): Object {
		return { url: window.location.pathname };
	},
	container: window.document.getElementById('reactContent')
});
