/**
 * @flow
 */
import { hasExpressRouter } from '../ExpressRoute';
import filterChildren from './filterChildren';

/**
 * Gets the react router route without any of the http handler routes.
 *
 * @param router {ReactRouterRoute}  The route to remove the http routes from
 *          NOTE: React routes can have http sub-routes, but http routes can not have React sub-routes
 *
 * @return  {ReactRouterRoute}  The route with out http handlers
 */
export default function getReactRouterRoute(router: ReactRouterRoute): ReactRouterRoute {
  return filterChildren(router, (route) => !hasExpressRouter(route));
}