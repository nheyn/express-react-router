/**
 * @flow
 */
import React from 'react';
import ReactDOMServer from 'react-dom/server';
import express from 'express';
import { match, RouterContext } from 'react-router';

import getReactRouterRoute from './router-traversal/getReactRouterRoute';
import getExpressRouter from './router-traversal/getExpressRouter';
import addPropsToRouter from './addPropsToRouter';

type Router = React.Element<*>;

type PropArg = Object | (req: Router) => Object;

/**
 * Create an express router for the given react-router routes.
 *
 * @param routes        {Router}                The router to render
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
  routes: Router,
  PageComponent: React.Component<*, *, *>,
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
  router.use(expressRouterFromRoute);
  router.use((req, res, next) => {
    // Render current route
    match({ routes: reactRouterRoutes, location: req.url }, (err, redirectLocation, renderProps) => {
      if(err) {
        // Handle errors in route
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

        // Render react-router handler
        const renderedReactHtml = ReactDOMServer.renderToString(routerContextElement);
        const pageHtml = ReactDOMServer.renderToStaticMarkup(
          // $FlowIssue
          <PageComponent req={req} reactHtml={renderedReactHtml} />
        );

        // Send entire page to client
        res
          .status(isPageNotFoundRoutes(renderProps.routes)? 404: 200)
          .send(`<!DOCTYPE html> ${pageHtml}`);
      }
      else {
        console.warn(`Did not find valid path(${req.url}) in router`);
        next();
      }
    });
  });

  return router;
}

function isPageNotFoundRoutes(routes: Array<any>): bool {
  const currRoutes = routes[routes.length - 1];
  if(!currRoutes.path) return false;

  // Check if last char is wild chard (means 404 in react-router)
  const lastCharInPath = currRoutes.path.charAt(currRoutes.path.length-1);
  return lastCharInPath === '*';
}
