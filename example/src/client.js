var { render } = require('express-react-router');
var routes = require('./routes');

// Render react-router to page
render({
	routes: routes,
	container: window.getElementById('reactContent')
});
