# Express React router
*Middleware for Express that Serves React Router Websites*

Creates a middleware router for [express.js](http://expressjs.com) that will render a [react-router](https://github.com/rackt/react-router) website on the server.
Also includes a new react render function for the client side, that helps with creating isomorphic websites (uses same route on client and server).

### Features
* Render a react-router route on both the client and the server
* Add other express middleware/router/static files directly to the react-router route
* Use the same react-router route (w/ express routes) on both the client and server

### Usage
See basic example in /example/ directory (see below for more information).

#### On Server
To create an express middleware router for react-router routes use 'createExpressRouter':
```
var ExpressReactRouter = require('express-react-router');

var reactRouterMiddleware = ExpressReactRouter.createExpressRouter({
	routes: routes,		// [Required] React Router routes
	props: { },			// [Optional] Props to send to the upper level componet in the route
	responseHandler: function(reactHtmlString, req, res) {				// [Required]
		// Send the 'reactHtmlString' to the client (using express res)
	},
	errorHandler: function(err, req, res) { 							// [Optional]
		// Handle the given error
	}
});
```

#### On Client
To render the routes in the browser use 'render':
```
ExpressReactRouter.render({
	routes: routes,			// [Required] React Router routes
	props: { },				// [Optional] Props to send to the upper level componet in the route
	container: el,			// [Required] The html element to render the route in
	callback: function() {	// [Optional] The callback call after rendering
		// Same as thrid argument to 'ReactDOM.render'
	}
});
```

### Documentation
Basic usage is given above. More detailed documentation is before class/function definitions within the code.

### Example
A basic site using express-react-router is in the /example/ directory.
To run using docker, run:
```
cd <path to repo>
docker build -t express-react-router/example ./example
docker build															\
	-d	-p <external port>:80											\
	-v "$(pwd)"/package.json:/var/express-react-router/package.json		\
	-v "$(pwd)"/src:/var/express-react-router/src						\
	express-react-router/example
```

### Plans
* Add option client to turn on react's touch events
* Add option client to show a loading placeholder on slow react-router transitions
* Create working example, that new project can start from
* Create flowtype definitions for public API
* Get documentation from code
