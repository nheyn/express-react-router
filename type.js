import type React from 'react';

type ExpressReq = any; //TODO
type ExpressRouter = any; //TODO

declare module "express-react-router" {
  declare export function handleReactRouter(
    routes: React.Element<*>,
    PageComponent: React.Component<*, *, *>,
    ...propArgs: Array<Object | (req: ExpressReq) => Object>
  ): ExpressRouter;
}

declare module "express-react-router/client" {
  declare export function render(
    routes: React.Element<*>,
    container: any,                //Should be DOMElement, using 'any' to match flow's react.js
    ...propArgs: Array<Object | () => Object>
  ): React.Component;
}
