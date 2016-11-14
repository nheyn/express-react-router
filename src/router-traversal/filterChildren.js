/**
 * @flow
 */
import React from 'react';

type Router = React.Element<*>;
type RouteReduceFunc = (route: Router) => bool;

/**
 * Get the given route with its children filtered using the given function.
 *
 * NOTE: Does not call render for each element, only get children from el.props.children
 * NOTE: The given route is not sent to the checkFn
 *
 * @param route   The react-router <Route /> to filter the children of
 * @param checkFn The function to check weather or not to keep the child
 *
 * @return        The react-router <Route /> without the filtered out children
 */
export default function filterChildren(route: Router, checkFn: RouteReduceFunc): Router {
  const { children } = route.props;
  if(!children) return route;

  return React.cloneElement(
    route,
    {},
    React.Children.toArray(children)
      .filter((child) => child? checkFn(child): false)
      .map((child) => filterChildren(child, checkFn))
  );
}
