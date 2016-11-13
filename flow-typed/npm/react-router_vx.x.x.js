/*
 * From https://github.com/marudor/flowInterfaces/blob/ff30d70d989a623b316ecf17aa8c4e26cd6fb026/packages/iflow-react-router/index.js.flow
 */
import React from 'react';

declare module 'react-router' {
  declare interface ReactRouter extends React.Component<*, *, *> {
    IndexRoute: React.Component<*, *, *>;
    Link: React.Component<*, *, *>;
    IndexLink: React.Component<*, *, *>;
    Redirect: React.Component<*, *, *>;
    IndexRedirect: React.Component<*, *, *>;
    Route: React.Component<*, *, *>;
    Router: React.Component<*, *, *>;
    browserHistory: any;
    useRouterHistory: (historyFactory: Function) => (options: ?Object) => Object;
    match: Function;
    RouterContext: React.Component<*, *, *>;
    createRoutes: (routes: React$Element<*>) => Array<Object>;
    formatPattern: (pattern: string, params: Object) => string;
    withRouter: (component: React.Component<*, *, *>, options: ?Object) => React.Component<*, *, *>;
  }
  declare var exports: ReactRouter;
}

declare module 'react-router/lib/PatternUtils' {
  declare var exports: any;
}

declare module 'history/lib/createBrowserHistory' {
  declare var exports: any;
}
