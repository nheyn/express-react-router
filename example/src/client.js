import 'babel-polyfill';

import React from 'react';
import { render } from 'express-react-router';

import routes from './routes';

// Turn on React Dev tools
window.React = React;

// Render react-router to page
render(
	routes,
	window.document.getElementById('reactContent'),
	{
		title: 'Express React Router Example Site'
	},
	() => {
		const url = window.location.pathname;

		document.title = `Example Page - ${url}`;
		return { url };
	}
);
