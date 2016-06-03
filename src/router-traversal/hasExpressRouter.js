/**
 * @flow
 */
import type { Route, IndexRoute } from 'react-router';

/**
 * Check if the given route contains an express router.
 *
 * @param route  The route to check for a router
 *
 * @return      TRUE if the given route contains a router, else FALSE
 */
export default function hasExpressRouter(route: Route | IndexRoute): bool {
  //NOTE: Remove in future version
  if(route.type && route.type.hasRouter === true) {
    console.warn(
      "<ExpressRoute /> has been deprecated, use react-router's <Route /> component with 'use' or 'src' prop."
    );
    return true;
  }
  //NOTE: Remove in future version

  //TODO, check if is <Route /> or <IndexRoute />
  return false;
}