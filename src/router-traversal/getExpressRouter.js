/**
 * @flow
 */
import express from 'express';


import hasExpressRouter from './hasExpressRouter';
import forEachRoute from './forEachRoute';

import type { Router, Route, IndexRoute } from 'react-router';

/**
 * Gets the express router defined in the react router Route.
 *
 * @param router  {Router}  The route to get the express router from
 *                                    NOTE: React routes can have http sub-routes, but http routes can not have
 *                                    React sub-routes
 *
 * @return        {ExpressRouter}     The router that handles all non page load requests
 */
export default function getExpressRouter(router: Router): ExpressRouter {
  let expressRouter = express.Router();
  forEachRoute(router, (route, path) => {
    if(hasExpressRouter(route)) expressRouter.use(path, getExpressRouterFrom(route));
  });
  return expressRouter;
}

/**
 * Gets the express router in the given route.
 *
 * @param route  The route to get the router from
 *
 * @return      The router from the route
 */
function getExpressRouterFrom({ props }: Route | IndexRoute): ExpressRouter {
  if(props.use)       return props.use;
  else if(props.src)  return express.static(props.src);
  else                throw new Error("RouterRoute must have 'use' or 'src' prop.");
}