/**
 * @flow
 */
import express from 'express';
import { Router, Route, IndexRoute } from 'react-router';

import isExpressRoute from './isExpressRoute';
import forEachRoute from './forEachRoute';

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
  if(router.type !== Router) throw new Error('Given router must be a react-router Router component.');

  let expressRouter = express.Router();

  addRouteToRouter(expressRouter, router);
  forEachRoute(router, (route, path) => addRouteToRouter(expressRouter, route, path));

  return expressRouter;
}

function addRouteToRouter(expressRouter: ExpressRouter, route: Router | Route | IndexRoute, path?: string) {
  if(route.type !== Router && route.type !== Route && route.type !== IndexRoute) {
    //NOTE: Remove in future version
    if(!isExpressRoute(route)) {
    //NOTE: Remove in future version
      throw new Error(`Invalid component(${route.type}) in router @ ${path? path: '/'}.`);
    }
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
