import { Reducer } from "redux";
import { type State } from "../store";
import {
	DELETE_CURRENT_USER,
	DELETE_TOKEN,
	SAVE_CURRENT_USER,
	SAVE_TOKEN,
} from "./types";

export const reducer: Reducer<State> = (state = {}, action) => {
	switch (action.type) {
		case SAVE_CURRENT_USER:
			return { ...state, user: action.payload };
		case DELETE_CURRENT_USER:
			return { ...state, user: undefined };
		case SAVE_TOKEN:
			return { ...state, token: action.payload };
		case DELETE_TOKEN:
			return { ...state, token: undefined };
		default:
			return state;
	}
};
