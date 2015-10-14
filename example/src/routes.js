var path = require('path');
var express = require('express');
var React = require('react');
var { Route, IndexRoute, Link } = require('react-router');
var { ExpressRoute } = require('express-react-router');

/*------------------------------------------------------------------------------------------------*/
//	--- React Router Components ---
/*------------------------------------------------------------------------------------------------*/
var PageWrapper =	React.createClass({
	render: function() {
		return (
			<div>
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
var PageOne =		React.createClass({ render: function() { return <div>PageOne</div>; } });
var PageTwo =		React.createClass({
	render: function() {
		return (
			<div>
				<div>PageTwo</div>
				<div>{this.props.children}</div>
			</div>
		);
	}
});
var SubPageOne = 	React.createClass({ render: function() { return <div>SubPageOne</div>; } });
var SubPageTwo = 	React.createClass({ render: function() { return <div>SubPageTwo</div>; } });

/*------------------------------------------------------------------------------------------------*/
//	--- Routers / Funcs / Files---
/*------------------------------------------------------------------------------------------------*/
var func = function(req, res) {
	res.send({ test: 'response' });
};
var router = express.Router();
router.use(func);

var errFunc = function(req, res) {
	throw new Error('Test Error');
};
var errRouter = express.Router();
errRouter.use(errFunc);

var appSrc =		path.join(__dirname, '../app.js');
var indenticonSrc =	path.join(__dirname, '../public/identicon.png');
var faviconSrc =	path.join(__dirname, '../public/favicon.ico');
var filesSrc =		path.join(__dirname, '../public/');

/*------------------------------------------------------------------------------------------------*/
//	--- Create Route ---
/*------------------------------------------------------------------------------------------------*/
var routes = (
	<Route>
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
	</Route>
);

/*------------------------------------------------------------------------------------------------*/
//	--- Exports ---
/*------------------------------------------------------------------------------------------------*/
module.exports = routes;
