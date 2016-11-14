/**
 * @flow
 */
import path from 'path';
import React from 'react';
import { IndexRoute } from 'react-router';

type Router = React.Element<*>;

type RouteMapFunc = (el: Router, path: string) => void;

/**
 * Call the given callback for each element in the given react-router <Route />.
 *
 * NOTE: Does not call render for each element, only get children from el.props.children
 *
 * @param route       The react-router <Route /> to traverse
 * @param mapFn       The function to call with each route, and its current path in the router
 * @param [currPath]  The path of the given route
 */
export default function forEachRoute(route: Router, mapFn: RouteMapFunc, currPath: string = '/') {
  mapFn(route, currPath);

  React.Children.forEach(route.props.children, (child) => {
    if(!child) return;
    const nextPath =  child.type === IndexRoute?
                        currPath:
                        child.props.path?
                          path.join(currPath, child.props.path):
                          currPath;

    forEachRoute(child, mapFn, nextPath);
  });
}
