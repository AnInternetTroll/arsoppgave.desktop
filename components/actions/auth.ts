import { Dispatch } from "redux";
import { DELETE_TOKEN } from "../reducers/types";
import { getApi } from "../utils/auth";

export function deleteToken(dispatch: Dispatch, token: string) {
	getApi("/auth/token/revoke", {
		method: "POST",
		token,
		body: {
			token: token,
		},
	});
	dispatch({ type: DELETE_TOKEN });
}
