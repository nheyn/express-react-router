import path from 'path';
import express from 'express';
import React from 'react';
import { Router, Route, IndexRoute, Link, browserHistory } from 'react-router';
import { ExpressRoute } from 'express-react-router';

/*------------------------------------------------------------------------------------------------*/
//	--- React Router Components ---
/*------------------------------------------------------------------------------------------------*/
const PageWrapper =	React.createClass({
	render: function() {
		//ERROR, <Links /> are reloading the entier page (?????????)
		return (
			<div>
				<h4>{this.props.title} - {this.props.url}</h4>
				<ul>
					<li><Link to="/">Page One</Link></li>
					<li>
						<Link to="/pageTwo">Page Two</Link>
						<ul>
							<li><Link to="/pageTwo/subPageOne">Subpage One</Link></li>
							<li><Link to="/pageTwo/subPageTwo">Subpage Two</Link></li>
							<li><a href="/pageTwo/identicon.png">indenticon</a></li>
						</ul>
					</li>
					<li><a href="/func">Func</a></li>
					<li><a href="/router">Router</a></li>
					<li><a href="/errorFunc">Error Func</a></li>
					<li><a href="/errorRouter">Error Router</a></li>
				</ul>
				<div>{this.props.children}</div>
			</div>
		);
	}
});
const PageOne =		React.createClass({ render: function() { return <div>PageOne</div>; } });
const PageTwo =		React.createClass({
	render: function() {
		return (
			<div>
				<div>PageTwo</div>
				<div>{this.props.children}</div>
			</div>
		);
	}
});
const SubPageOne = 	React.createClass({ render: function() { return <div>SubPageOne</div>; } });
const SubPageTwo = 	React.createClass({ render: function() { return <div>SubPageTwo</div>; } });

/*------------------------------------------------------------------------------------------------*/
//	--- Routers / Funcs / Files ---
/*------------------------------------------------------------------------------------------------*/
let func, router, errFunc, errRouter, appSrc, indenticonSrc, faviconSrc, filesSrc;
if(typeof window === 'undefined') {	// Peform only on the server
	func = function(req, res) {
		res.send({ test: 'response' });
	};
	router = express.Router();
	router.use(func);

	errFunc = function(req, res) {
		throw new Error('Test Error');
	};
	errRouter = express.Router();
	errRouter.use(errFunc);

	appSrc =		path.join(__dirname, '../app.js');
	indenticonSrc =	path.join(__dirname, '../public/identicon.png');
	faviconSrc =	path.join(__dirname, '../public/favicon.ico');
	filesSrc =		path.join(__dirname, '../public/');
}

/*------------------------------------------------------------------------------------------------*/
//	--- Create Route ---
/*------------------------------------------------------------------------------------------------*/
export default (
	<Router history={browserHistory} >
		<Route			path="/"			component={PageWrapper}>
			<IndexRoute							component={PageOne} />
			<Route 			path="pageTwo"		component={PageTwo}>
				<Route 			path="subPageOne"		component={SubPageOne} />
				<Route 			path="subPageTwo"		component={SubPageTwo} />
				<ExpressRoute	path="identicon.png"	src={indenticonSrc} />
			</Route>
			<ExpressRoute	path="favicon.ico"	src={faviconSrc} />
			<ExpressRoute	path="app.js"		src={appSrc} />
			<ExpressRoute	path="files"		src={filesSrc} />
			<ExpressRoute	path="func"			callback={func} />
			<ExpressRoute	path="router"		router={router} />
			<ExpressRoute	path="errorFunc"	callback={errFunc} />
			<ExpressRoute	path="errorRouter"	router={errRouter} />
		</Route>
	</Router>
);
