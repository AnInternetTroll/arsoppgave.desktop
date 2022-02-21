import { useMemo } from "react";
import { applyMiddleware, createStore, Store } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import thunk from "redux-thunk";
import { Token, User } from "./api_types";
import rootReducer from "./reducers";

export interface State {
	auth?: {
		user?: User;
		token?: Token;
	};
}

export const initialState: State = { auth: {} };

function makeStore(initialState1 = initialState) {
	return createStore(
		rootReducer,
		initialState1,
		composeWithDevTools(applyMiddleware(thunk)),
	);
}

let store: Store<State> | undefined;

export default function initializeStore(preloadedState: State | undefined) {
	let _store = store ?? makeStore(preloadedState);

	// After navigating to a page with an initial Redux state, merge that state
	// with the current state in the store, and create a new store
	if (preloadedState && store) {
		_store = makeStore({
			...store.getState(),
			...preloadedState,
		});
		// Reset the current store
		store = undefined;
	}

	// For SSG and SSR always create a new store
	if (typeof window === "undefined") return _store;
	// Create the store once in the client
	if (!store) store = _store;

	return _store;
}

export function useStore(initialState: State | undefined) {
	const store = useMemo(() => initializeStore(initialState), [initialState]);
	return store;
}
