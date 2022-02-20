import { Dispatch } from "redux";
import { Token } from "../api_types";
import { DELETE_TOKEN, SAVE_TOKEN } from "../reducers/types";

export function saveToken(token: Token) {
	return (dispatch: Dispatch) =>
		dispatch({ type: SAVE_TOKEN, payload: token });
}

export function deleteToken() {
	return (dispatch: Dispatch) => dispatch({ type: DELETE_TOKEN });
}
