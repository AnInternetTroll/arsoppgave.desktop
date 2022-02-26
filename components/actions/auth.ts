import { Dispatch } from "redux";
import { DELETE_TOKEN } from "../reducers/types";

export function deleteToken(dispatch: Dispatch, token: string) {
	fetch(`${process.env.API}/auth/token/revoke`, {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			authorization: `Bearer ${token}`,
		},
		body: JSON.stringify({
			token: token,
		}),
	});
	dispatch({ type: DELETE_TOKEN });
}
