/**
 * @flow
 *
 * //NOTE: Remove in future version
 */
import type React from 'react';

type Route = React.Element<*>;
type IndexRoute = React.Element<*>;

/**
 * Check if the given route contains an express router.
 *
 * @param route  The route to check for a router
 *
 * @return      TRUE if the given route contains a router, else FALSE
 */
export default function isExpressRoute(route: Route | IndexRoute): bool {
  if(route.type.hasRouter !== true) return false;

  console.warn(
    "<ExpressRoute /> has been deprecated, use react-router's <Route /> component with 'use' or 'src' prop."
  );
  return true;
}
