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

#### Add Express Routers
To add an express router(s) to the react-router jsx router, add the 'use'/'add'/'get'/'post'/'put'/'delete' prop to a <Router />, <Route /> or <IndexRoute /> component. To add static files to the router add the 'src' prop to a component.

```
const router = (
  <Router>
    <Route path="/" use={someMiddleware}>                   {/* Use the given express middleware function or router */}
      <IndexRoute component={Home} />                       {/* Rendering given component */}
      <Route path="/logo.png" src="path/to/logo.png" />     {/* Serve the static files at the given path */}
    </Route>
  </Router>
);
```

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
*NOTE:* The rest arguments can be functions that are passed the current request and returns the props to add.


#### On Client
To render the routes in the browser use 'render':
```
var ExpressReactRouter = require('express-react-router/client');

ExpressReactRouter.render({
  routes    // [Required]       React Router routes
  container // [Required]       The html element to render the route in
  ...props  // [Optional/Rest]  Objects that contain props to add to the routers Components
});
```

*NOTE:* The rest arguments can be functions that returns the props to add. They are called when the component is rendered or updated.


### Documentation
Basic usage is given above. More detailed documentation is before class/function definitions within the code.

### Example
A basic site using express-react-router is in my [react-stack-skeleton](https://github.com/nheyn/react-stack-skeleton) repo.

### Plans
* Get documentation from code
* Add unit tests to each function
