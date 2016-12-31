/**
 * @flow
 */
import React from 'react';
import express from 'express';
import { Router, Route, IndexRoute } from 'react-router';

import forEachRoute from './forEachRoute';
import wasMadeUsing from './wasMadeUsing';

import type { Router as ExpressRouter } from 'express';

/**
 * Gets the express router defined in the react router Route.
 *
 * @param router  {Router}            The route to get the express router from
 *                                    NOTE: React routes can have http sub-routes, but http routes can not have
 *                                    React sub-routes
 *
 * @return        {ExpressRouter}     The router that handles all non page load requests
 */
export default function getExpressRouter(router: Router): ExpressRouter {
  // Skip wrapper components (like react-redux Provider)
  if(!wasMadeUsing(router, Router)) {
    if(React.Children.count(router.props.children) !== 1) throw new Error('Must be given a single root Router.');
    const child = React.Children.only(router.props.children);

    return getExpressRouter(child);
  }

  let expressRouter = express.Router();

  addRouteToRouter(expressRouter, router);
  forEachRoute(router, (route, path) => addRouteToRouter(expressRouter, route, path));

  return expressRouter;
}

function addRouteToRouter(expressRouter: ExpressRouter, route: Router | Route | IndexRoute, path?: string) {
  if(!wasMadeUsing(route, Router) && !wasMadeUsing(route, Route) && !wasMadeUsing(route, IndexRoute)) {
    throw new Error(`Invalid component(${route.type}) in router @ ${path? path: '/'}.`);
  }

  // Check and add routers for each method
  ['use', 'all', 'get', 'post', 'put', 'delete'].forEach((method) => {
    const currRouter = route.props[method];
    if(!currRouter) return;

    // $FlowFixMe
    const currMethod = expressRouter[method];
    if(path) {
      if(Array.isArray(currRouter)) currMethod(path, ...currRouter);
      else                          currMethod(path, currRouter);
    }
    else {
      if(Array.isArray(currRouter)) currMethod(...currRouter);
      else                          currMethod(currRouter);
    }
  });

  // Check and add router for static files to serve
  if(route.props.src) {
    const staticRouter = express.static(route.props.src);

    if(path)  expressRouter.use(path, staticRouter);
    else      expressRouter.use(staticRouter)
  }
}
