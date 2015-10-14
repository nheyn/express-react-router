declare module 'react-dom/server' {
	declare function renderToString(
		element: ReactElement<any, any, any>
	): string;

	declare function renderToStaticMarkup(
		element: ReactElement<any, any, any>
	): string;
}
