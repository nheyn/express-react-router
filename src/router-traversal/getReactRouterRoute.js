/**
 * @flow
 */
import { Route, IndexRoute } from 'react-router';

import isExpressRoute from './isExpressRoute';
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
  return filterChildren(router, (route) => containsReactComponent(route));
}

function containsReactComponent(route: Route | IndexRoute): bool {
  //NOTE: Remove in future version
  if(isExpressRoute(route)) return false;
  //NOTE: Remove in future version

  if(route.type === Route || route.type === IndexRoute) {
    const { props } = route;

    if(props.component) return true;
  }

  return false;
}