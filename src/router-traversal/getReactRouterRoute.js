/**
 * @flow
 */
import React from 'react';
import { Router, Route, IndexRoute } from 'react-router';

import filterChildren from './filterChildren';
import wasMadeUsing from './wasMadeUsing';

/**
 * Gets the react router route without any of the http handler routes.
 *
 * @param router  {Router} The route to remove the http routes from
 *                         NOTE: React routes can have http sub-routes, but http routes can not have React sub-routes
 *
 * @return        {Router} The route with out http handlers
 */
export default function getReactRouterRoute(router: React.Element<*>): React.Element<*> {
  // Skip wrapper components (like react-redux Provider)
  if(!wasMadeUsing(router, Router)) {
    if(React.Children.count(router.props.children) !== 1) throw new Error('Must be given a single root Router.');
    const child = React.Children.only(router.props.children);

    return React.cloneElement(router, null, getReactRouterRoute(child));
  }

  return filterChildren(router, (route) => containsReactComponent(route));
}

function containsReactComponent(route: Route | IndexRoute): bool {
  if(wasMadeUsing(route, Route) || wasMadeUsing(route, IndexRoute)) {
    const { props } = route;

    // Check if this component has a react component
    if(props.component) return true;

    // Check if the children has a react component
    if(props.children) {
      let childHasReactComponent = false;
      React.Children.forEach(props.children, (child) => {
        childHasReactComponent = childHasReactComponent || containsReactComponent(child);
      });
      if(childHasReactComponent) return true;
    }
  }

  return false;
}
