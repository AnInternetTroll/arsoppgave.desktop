import { applyMiddleware, createStore } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import thunk from "redux-thunk";
import { Token, User } from "./api_types";
import rootReducer from "./reducers";

const LOCAL_STORAGE_KEY = "STATE";

export interface State {
	auth?: {
		user?: User;
		token?: Token;
	};
}

export const initialState: State = { auth: {} };

function loadFromLocalStorage(): State | undefined {
	try {
		const serializedState = localStorage.getItem(LOCAL_STORAGE_KEY);
		if (serializedState === null) return undefined;
		return JSON.parse(serializedState) as State;
	} catch (e) {
		console.error(e);
	}
}

function saveToLocalStorage(state: State): void {
	try {
		const serializedState = JSON.stringify(state);
		localStorage.setItem(LOCAL_STORAGE_KEY, serializedState);
	} catch (e) {
		console.error(e);
	}
}

export default function initializeStore(initialState = {}) {
	return createStore(
		rootReducer,
		loadFromLocalStorage(),
		composeWithDevTools(applyMiddleware(thunk)),
	);
}
