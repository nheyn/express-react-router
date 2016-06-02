# Express React Router
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

var reactRouterMiddleware = ExpressReactRouter.createExpressRouter(
  routes,       // [Required]       React Router routes
  PageHandler,  // [Required]       A component the renders the entire html page
  ...props      // [Optional/Rest]  Objects that contain props to add to the routers Components
);
```
*NOTE:* The final arguments can be functions that are passed the current request and returns the props to add.


#### On Client
To render the routes in the browser use 'render':
```
ExpressReactRouter.render({
  routes    // [Required]       React Router routes
  container // [Required]       The html element to render the route in
  ...props  // [Optional/Rest]  Objects that contain props to add to the routers Components
});
```

*NOTE:* The final arguments can be functions that returns the props to add. They are called when the component is rendered or updated.


### Documentation
Basic usage is given above. More detailed documentation is before class/function definitions within the code.

### Example
A basic site using express-react-router is in the /example/ directory.
To run using docker, run:
```
cd <path to repo>
docker build -t express-react-router:example .
docker build -d  -p <external port>:8080 express-react-router:example
```

### Plans
* Get documentation from code
* Create boilerplate example, that new projects can start from
* Create flowtype definitions for public API
