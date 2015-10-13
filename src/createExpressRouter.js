/**
 * @flow
 */

type ServerSettings = {
	routes: ReactRouterRoute,
	props: ?({[key: string]: any} | (req: ExpressReq) => {[key: string]: any}),
	responseHandler: (reactStr: string, req: ExpressReq, res: ExpressRes) => void,
	errorHandler: ?(err: Error, req: ExpressReq, res: ExpressRes) => void,
};

/**
 * //TODO
 */
function createExpressRouter(settings: ServerSettings): ExpressRouter {
	//TODO
}

/*------------------------------------------------------------------------------------------------*/
//	--- Exports ---
/*------------------------------------------------------------------------------------------------*/
module.exports = createExpressRouter;
