/**
 * @flow
 */
import express from 'express';
import { Router, Route, IndexRoute } from 'react-router';

import isExpressRoute from './isExpressRoute';
import forEachRoute from './forEachRoute';

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
  let expressRouter = express.Router();

  if(router.type !== Router) throw new Error('Given router must be a react-router Router component');
  if(containsExpressRouter(router)) {
    expressRouter.use(getExpressRouterFrom(router));
  }

  forEachRoute(router, (route, path) => {
    if(containsExpressRouter(route)) {
      expressRouter.use(path, getExpressRouterFrom(route));
    }
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

function containsExpressRouter(route: Route | IndexRoute): bool {
  //NOTE: Remove in future version
  if(isExpressRoute(route)) return true;
  //NOTE: Remove in future version

  if(route.type === Router || route.type === Route || route.type === IndexRoute) {
    const { props } = route;

    if(props.use) return true;
    if(props.src) return true;
    return (props.use || props.src)? true: false;
  }

  return false;
}