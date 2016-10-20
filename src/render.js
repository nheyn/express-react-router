/**
 * @flow
 */
import React from 'react';
import ReactDOM from 'react-dom';

import getReactRouterRoute from './router-traversal/getReactRouterRoute';
import addPropsToRouter from './addPropsToRouter';

type Router = React.Element<*>;

/**
 * Render the given routes to the given container.
 *
 * @param routes      {ReactRouterRoute}      The router to render
 * @param container   {DOMElement}            Same as second argument to 'ReactDOM.render'
 * @param ...propArgs {Array<Object | Func>}  All arguments after routes is used to add props to the top-level
 *                                            components in the router. If given as a function, it will be called
 *                                            when the component is rendered or updated.
 *
 * @return            {ReactComponent}        The render componet (see return of 'React.render')
 */
export default function render(
  routes: Router,
  container: any,         //NOTE, 'any' is in lib/react.js but is really a DOMElement
  ...propArgs: Array<Object | () => Object>
): React.Component<*, *, *> {
  // Check args
  if(!routes) throw new Error('Route is required to render');
  if(!container) throw new Error('A container is required to render');

  // Parse routes
  const parsedRoutes = getReactRouterRoute(routes);

  // Render current route
  if(!propArgs || propArgs.length === 0) {
    return ReactDOM.render(parsedRoutes, container);
  }
  else {
    // Split up static and dynamic props
    let staticProps = {};
    const dynamicPropFuncs: Array<() => Object> = propArgs.filter((propArg) => {
      if(typeof propArg === 'function') return true;

      staticProps = { ...staticProps, ...propArg };
      return false;
    });

    if(dynamicPropFuncs.length === 0) {
      const routesWithProps = addPropsToRouter(routes, staticProps);

      return ReactDOM.render(routesWithProps, container);
    }
    else {
      return renderWithProps(parsedRoutes, container, staticProps, () => {
        let props = {};
        dynamicPropFuncs.forEach((getProps) => {
          props = { ...props, ...getProps() };
        });
        return props;
      });
    }
  }
}

function renderWithProps(
  routes: Router,
  container: any,
  staticProps: Object,
  getDynamicProps: () => Object
): React.Component<*, *, *> {
  // Add props to the router
  const routesWithProps = addPropsToRouter(routes, staticProps, getDynamicProps);

  // Recall this function if callback is called (skip first to avoid infinite loop)
  let hasRenderedBefore = false;
  const renderCallback = () => {
    if(hasRenderedBefore)   renderWithProps(routes, container, staticProps, getDynamicProps);
    else                    hasRenderedBefore = true;
  };

  return ReactDOM.render(routesWithProps, container, renderCallback);
}
