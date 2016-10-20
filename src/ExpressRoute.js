/**
 * @flow
 */
import React from 'react';
import express from 'express';

/**
 * A React class, that can be use instead of React Router's Route class, that can
 */
const ExpressRoute = React.createClass({
  statics: {
    hasRouter: true
  },
  propTypes: {
    path: React.PropTypes.string,
    src: React.PropTypes.string,
    use: React.PropTypes.any,
  },
  render(): React.Element<*> {
    throw new Error('RouterRoute should never be rendered');
  }
});
export default ExpressRoute;
