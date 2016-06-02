/**
 * @flow
 */
import express from 'express';

import { hasExpressRouter, getExpressRouterFrom } from '../ExpressRoute';
import forEachRoute from './forEachRoute';

/**
 * Gets the express router defined in the react router Route.
 *
 * @param router  {ReactRouterRoute}  The route to get the express router from
 *                                    NOTE: React routes can have http sub-routes, but http routes can not have
 *                                    React sub-routes
 *
 * @return        {ExpressRouter}     The router that handles all non page load requests
 */
export default function getExpressRouter(router: ReactRouterRoute): ExpressRouter {
  let expressRouter = express.Router();
  forEachRoute(router, (route, path) => {
    if(hasExpressRouter(route)) expressRouter.use(path, getExpressRouterFrom(route));
  });
  return expressRouter;
}