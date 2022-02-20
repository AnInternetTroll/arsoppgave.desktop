import App from "next/app";
import React from "react";
import { Provider } from "react-redux";
import { AnyAction, EmptyObject, Store } from "redux";
import initializeStore, { initialState, State } from "./store";

export const withRedux = (
	PageComponent: typeof React.Component,
	{ ssr = true } = {},
) => {
	const isDevelopment = process.env.NODE_ENV !== "production";
	const WithRedux = (
		{ initialReduxState, ...props }: {
			initialReduxState: State;
		},
	) => {
		const store = getOrInitializeStore(initialReduxState);
		return (
			<Provider store={store}>
				<PageComponent {...props} />
			</Provider>
		);
	};

	// Make sure people don't use this HOC on _app.js level
	if (isDevelopment) {
		const isAppHoc = PageComponent === App ||
			PageComponent.prototype instanceof App;
		if (isAppHoc) {
			throw new Error("The withRedux HOC only works with PageComponents");
		}
	}

	// Set the correct displayName in development
	if (isDevelopment) {
		// @ts-expect-error Honestly I have no idea why or what displayName is.
		const displayName = PageComponent.displayName || PageComponent.name ||
			"Component";

		WithRedux.displayName = `withRedux(${displayName})`;
	}

	if (
		ssr ||
		// @ts-expect-error getInitialProps is a nextjs thing
		PageComponent.getInitialProps
	) {
		WithRedux.getInitialProps = async (
			context: {
				reduxStore: Store<State, AnyAction> & {
					dispatch: unknown;
				};
			},
		) => {
			// Get or Create the store with `undefined` as initialState
			// This allows you to set a custom default initialState
			const reduxStore = getOrInitializeStore();

			// Provide the store to getInitialProps of pages
			context.reduxStore = reduxStore;

			// Run getInitialProps from HOCed PageComponent
			const pageProps =
				// @ts-expect-error Another nextjs thing
				typeof PageComponent.getInitialProps === "function"
					// @ts-expect-error Another nextjs thing
					? await PageComponent.getInitialProps(context)
					: {};

			// Pass props to PageComponent
			return {
				...pageProps,
				initialReduxState: reduxStore.getState(),
			};
		};
	}

	return WithRedux;
};

let reduxStore: ReturnType<typeof initializeStore>;
const getOrInitializeStore = (initialState1?: State) => {
	// Always make a new store if server, otherwise state is shared between requests
	if (typeof window === "undefined") {
		return initializeStore(initialState1);
	}

	// Create store if unavailable on the client and set it on the window object
	if (!reduxStore) {
		reduxStore = initializeStore(initialState1);
	}

	return reduxStore;
};
