//NOTE: Remove in future version
import clientRender from './lib/render';
import type React from 'react';
export function render(...args: Array<any>): React.Component {
  console.warn('The render(...) function should be imported from "express-react-router/client".');

  return clientRender(...args);
}
export { default as ExpressRoute } from './lib/ExpressRoute';
//NOTE: Remove in future version

export { default as handleReactRouter } from './lib/handleReactRouter';
