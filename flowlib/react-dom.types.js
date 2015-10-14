declare module 'react-dom' {
	declare function render<D, P, S>(
		element: ReactElement<D, P, S>,
		container: any
	): ReactComponent<D, P, S>;
}

declare module 'react-dom/server' {
	declare function renderToString(
		element: ReactElement<any, any, any>
	): string;

	declare function renderToStaticMarkup(
		element: ReactElement<any, any, any>
	): string;
}
