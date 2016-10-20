/**
 * @flow
 */
import React from 'react';

type Router = React.Element<*>;

/**
 * Add props to a the top level component when a route is rendered.
 *
 * @param router    {ReactRouter} The react-router <Router /> element to add props to
 * @param props     {Object}      The props to add the rendered component
 * @param getProps  {Function}    A function that is called every time a top-level component is added, the return
 *                                value will be add it's props
 *
 * @return          {ReactRouter} The router that will add props to the rendered component
 */
export default function addPropsToRouter(
  router: Router,
  props: ?Object,
  getProps?: Function
): Router {
  const createElement = (Component, reactRouterProps) => {
    const staticProps = props? props: {};
    const dynamicProps = getProps? getProps(): {};

    return <Component {...reactRouterProps} {...staticProps} {...dynamicProps} />;
  };

  return React.cloneElement(router, { createElement });
}
