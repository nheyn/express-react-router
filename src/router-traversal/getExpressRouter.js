/**
 * @flow
 */
import React from 'react';
import express from 'express';
import { Router, Route, IndexRoute } from 'react-router';

import forEachRoute from './forEachRoute';
import wasMadeUsing from './wasMadeUsing';

import type { Router as ExpressRouter, Middleware } from 'express';

/**
 * Gets the express router defined in the react router Route.
 *
 * @param router  {Router}            The route to get the express router from
 *                                    NOTE: React routes can have http sub-routes, but http routes can not have
 *                                    React sub-routes
 *
 * @return        {ExpressRouter}     The router that handles all non page load requests
 */
export default function getExpressRouter(router: Router): ExpressRouter {
  // Skip wrapper components (like react-redux Provider)
  if(!wasMadeUsing(router, Router)) {
    if(React.Children.count(router.props.children) !== 1) throw new Error('Must be given a single root Router.');
    const child = React.Children.only(router.props.children);

    return getExpressRouter(child);
  }

  let expressRouter = express.Router();

  addRouteToRouter(expressRouter, router);
  forEachRoute(router, (route, path) => addRouteToRouter(expressRouter, route, path));

  return expressRouter;
}

function addRouteToRouter(expressRouter: ExpressRouter, route: Router | Route | IndexRoute, path?: string) {
  if(!wasMadeUsing(route, Router) && !wasMadeUsing(route, Route) && !wasMadeUsing(route, IndexRoute)) {
    throw new Error(`Invalid component(${route.type}) in router @ ${path? path: '/'}.`);
  }

  // Check and add routers for each method
  const routerPropsHas = (method: 'use' | 'all' | 'get' | 'post' | 'put' | 'delete'): bool => {
    return route.props[method]? true: false;
  };
  const getArrayOfRouters = (method: 'use' | 'all' | 'get' | 'post' | 'put' | 'delete'): Array<Middleware> => {
    return Array.isArray(route.props[method])? route.props[method]: [ route.props[method] ];
  };

  if(routerPropsHas('use')) {
    const currRouters = getArrayOfRouters('use');

    if(path)  expressRouter.use(path, ...currRouters)
    else      expressRouter.use(...currRouters);
  }

  if(routerPropsHas('all')) {
    const currRouters = getArrayOfRouters('all');

    if(path)  expressRouter.all(path, ...currRouters)
    else      expressRouter.all(...currRouters);
  }

  if(routerPropsHas('get')) {
    const currRouters = getArrayOfRouters('get');

    if(path)  expressRouter.get(path, ...currRouters)
    else      expressRouter.get(...currRouters);
  }

  if(routerPropsHas('post')) {
    const currRouters = getArrayOfRouters('post');

    if(path)  expressRouter.post(path, ...currRouters)
    else      expressRouter.post(...currRouters);
  }

  if(routerPropsHas('put')) {
    const currRouters = getArrayOfRouters('put');

    if(path)  expressRouter.put(path, ...currRouters)
    else      expressRouter.put(...currRouters);
  }

  if(routerPropsHas('delete')) {
    const currRouters = getArrayOfRouters('delete');

    if(path)  expressRouter.delete(path, ...currRouters)
    else      expressRouter.delete(...currRouters);
  }

  // Check and add router for static files to serve
  if(route.props.src) {
    const staticRouter = express.static(route.props.src);

    if(path)  expressRouter.use(path, staticRouter);
    else      expressRouter.use(staticRouter)
  }
}
