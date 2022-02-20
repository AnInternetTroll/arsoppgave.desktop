import App from "next/app";
import { NextComponentType, NextPageContext } from "next/types";
import React from "react";
import { Provider } from "react-redux";
import initializeStore, { State } from "./store";

export const withRedux = (
	PageComponent: NextComponentType<NextPageContext, any, any>,
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
		// @ts-expect-error idk what this means ngl
		const isAppHoc = PageComponent === App ||
			PageComponent.prototype instanceof App;
		if (isAppHoc) {
			throw new Error("The withRedux HOC only works with PageComponents");
		}
	}

	// Set the correct displayName in development
	if (isDevelopment) {
		const displayName = PageComponent.displayName || PageComponent.name ||
			"Component";

		WithRedux.displayName = `withRedux(${displayName})`;
	}

	if (
		ssr ||
		PageComponent.getInitialProps
	) {
		WithRedux.getInitialProps = async (
			context: NextPageContext,
		) => {
			// Get or Create the store with `undefined` as initialState
			// This allows you to set a custom default initialState
			const reduxStore = getOrInitializeStore();

			// Provide the store to getInitialProps of pages
			// @ts-ignore copy pasted from redux nextjs example
			context.reduxStore = reduxStore;

			// Run getInitialProps from HOCed PageComponent
			const pageProps =
				typeof PageComponent.getInitialProps === "function"
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
