var React = require('react');
var { render } = require('express-react-router');
var routes = require('./routes');

// Turn on React Dev tools
window.React = React;

// Render react-router to page
render({
	routes: routes,
	container: window.document.getElementById('reactContent')
});
