/**
 * @flow
 */
import { hasExpressRouter } from '../ExpressRoute';
import filterChildren from './filterChildren';

import type { Router } from 'react-router';

/**
 * Gets the react router route without any of the http handler routes.
 *
 * @param router  {Router} The route to remove the http routes from
 *                         NOTE: React routes can have http sub-routes, but http routes can not have React sub-routes
 *
 * @return        {Router} The route with out http handlers
 */
export default function getReactRouterRoute(router: Router): Router {
  return filterChildren(router, (route) => !hasExpressRouter(route));
}