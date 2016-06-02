declare module "react-router" {
  declare var Route: ReactClass;
  declare var RouterContext: ReactClass;
  declare var match: (settings: MatchFuncSettings, callback: MatchFuncCallback) => void;
}

type ReactRouterHandler<D,P,S> = ReactClass<D,P,S>;
type ReactRouterRoute<D,P,S> = ReactElement<D,P,S>;

type MatchFuncSettings = { routes: ReactRouterRoute<any, any, any>, location: string };
type MatchFuncCallback = (
  err: ?Error,
  redirectLocation: {pathname: string, search: string},
  renderProps: {[key: string]: any }
) => void;
