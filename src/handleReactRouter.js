/**
 * @flow
 */
import React from 'react';
import { Router } from 'react-router';
import ReactDOMServer from 'react-dom/server';
import express from 'express';
import { match, RouterContext } from 'react-router';

import getReactRouterRoute from './router-traversal/getReactRouterRoute';
import getExpressRouter from './router-traversal/getExpressRouter';
import wasMadeUsing from './router-traversal/wasMadeUsing';
import addPropsToRouter from './addPropsToRouter';

import type { $Request as Request, Router as ExpressRouter } from 'express';
type ReactRouter = React.Element<*>;

type PropArg = Object | (req: Request) => Object;

/**
 * Create an express router for the given react-router routes.
 *
 * @param routes        {ReactRouter}           The router to render
 * @param PageComponent {ReactClass}            A class that takes the render html string, reactHtml, and a
 *                                              express request, req, as a prop and returns markup for the
 *                                              entire page.
 *                                              NOTE: This is render using 'renderToStaticMarkdown(...)' with
 *                                              '<!DOCTYPE html>' placed before it.
 * @param ...propArgs   {Array<Object | Func>}  All arguments after routes is used to add props to the top-level
 *                                              components in the router
 *
 * @return              {ExpressRouter}         The express router to add to the express application
 */
export default function handleReactRouter(
  routes: ReactRouter,
  //ERROR, aperently React.Component<*, *, *> is not a component: "Expected React component instead of React$Component"
  PageComponent: any,
  ...propArgs: Array<PropArg>
): ExpressRouter {
  // Check args route
  if(!routes) throw new Error('Route is required for the server');
  if(!PageComponent) throw new Error('PageComponent is required for the server');

  // Combine props
  const getAllProps = (req) => {
    let currProps = {};
    propArgs.forEach((nextProps) => {
      const newProps = typeof nextProps === 'function'? nextProps(req): nextProps;

      currProps = { ...currProps, ...newProps };
    });
    return currProps;
  };

  // Parse Routes
  const reactRouterRoutes = getReactRouterRoute(routes);
  const expressRouterFromRoute = getExpressRouter(routes);

  // Create express router
  let router = express.Router();
  //$FlowFixMe
  router.use(expressRouterFromRoute);
  // $FlowFixMe
  router.use((req, res, next) => {
    // Skip wrapper components (like react-redux Provider)
    const { routes, rewrapRouter } = unwrapRouter(reactRouterRoutes);

    // Render current route
    match({ routes, location: req.url }, (err, redirectLocation, renderProps) => {
      if(err) {
        // Handle errors below
        next(err);
      }
      else if(redirectLocation) {
        // Handle redirect
        res.redirect(302, redirectLocation.pathname + redirectLocation.search)
      }
      else if(renderProps) {
        let routerContextElement = <RouterContext {...renderProps} />;

        // Add props
        if(propArgs.length) routerContextElement = addPropsToRouter(routerContextElement, getAllProps(req));

        // Render page with current element from router
        const renderedReactHtml = ReactDOMServer.renderToString(rewrapRouter(routerContextElement));
        const pageHtml = ReactDOMServer.renderToStaticMarkup(
          //TODO, rewrap router agian because match(...) is a horibly written function
          <PageComponent req={req} reactHtml={renderedReactHtml} />
        );

        // Send entire page to client
        res
          .status(isPageNotFoundRoutes(renderProps.routes)? 404: 200)
          .send(`<!DOCTYPE html> ${pageHtml}`);
      }
      else {
        // Render page with error
        const pageHtml = ReactDOMServer.renderToStaticMarkup(
          <PageComponent req={req} error={new Error(`Invalid url: ${req.url}`)} is404 />
        );

        // Send entire page to client
        res
          .status(404)
          .send(`<!DOCTYPE html> ${pageHtml}`);
      }
    });
  });
  // $FlowFixMe
  router.use((err, req, res, next) => {
    // Skip this middleware if the request doesn't not accept html
    if(!req.accepts('html')) {
      next(err);
      return;
    }

    // Render page with error
    const pageHtml = ReactDOMServer.renderToStaticMarkup(
      <PageComponent req={req} error={err} />
    );

    // Send entire page to client
    res
      .status(500)
      .send(`<!DOCTYPE html> ${pageHtml}`);
  });

  return router;
}

function isPageNotFoundRoutes(routes: Array<any>): bool {
  const currRoutes = routes[routes.length - 1];
  if(!currRoutes.path) return false;

  // Check if last char is wild chard, NOTE: means any wildcard (non-404) pages must use params
  const lastCharInPath = currRoutes.path.charAt(currRoutes.path.length-1);
  return lastCharInPath === '*';
}

function unwrapRouter(
  el: React.Element<*>,
  rewrapRouter?: (el: React.Element<*>) => React.Element<*>,
): { routes: React.Element<*>, rewrapRouter: (el: React.Element<*>) => React.Element<*> } {
  if(wasMadeUsing(el, Router)) {
    return {
      routes: el,
      rewrapRouter(currEl) {
        return rewrapRouter? rewrapRouter(currEl): currEl;
      },
    };
  }

  if(React.Children.count(el.props.children) !== 1) throw new Error('Must be given a single root Router.');
  const child = React.Children.only(el.props.children);

  return unwrapRouter(
    child,
    (childEl) => {
      const wrappedEl = React.cloneElement(el, null, childEl);

      return rewrapRouter? rewrapRouter(wrappedEl): wrappedEl;
    },
  );
}
