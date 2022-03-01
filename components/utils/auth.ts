import { ApiError, Token, User } from "../api_types";

/**
 * A helper function to get a user from a token.
 * It may throw if the token is invalid or expired
 * @param token A valid bearer token
 * @returns The user that the token belongs to
 */
export async function getUser(
	{ token, id }: { token?: string; id?: string },
): Promise<User> {
	return getApi<User>(`/users/${id ? id : "@me"}`, { token });
}

/**
 * Login into a user's account with their credentials.
 * If this fails it will throw an error.
 * @param email A valid email address
 * @param password
 * @returns A token object which should be used to get a User
 */
export function login(email: string, password: string): Promise<Token> {
	return getApi<Token>("/auth/token", {
		headers: {
			Authorization: `Basic ${btoa(`${email}:${password}`)}`,
		},
	});
}

/**
 * Login into a user's account with their credentials.
 * If this fails it will throw an error.
 * @param email A valid email address
 * @param password
 * @returns A token object which should be used to get a User
 */
export function register(
	{ email, password, username }: {
		email: string;
		password: string;
		username: string;
	},
): Promise<true> {
	return getApi<null>("/auth/register", {
		method: "POST",
		body: { username, password, email },
	}).then(response => !response);
}

/**
 * A helper function which can make requests to the backend
 * and throw an error when the status is unexpected.
 *
 * @param endpoint An API endpoint where the request will be made
 *
 * @returns The response from the API. If you know what to expect then pass a generic argument
 * It may return `null` if the server doesn't respond with a body
 */
export async function getApi<T>(
	endpoint: string,
	{ body, token, method = "GET", signal, headers }: {
		body?: Record<string, string>;
		token?: string;
		method?: "GET" | "POST" | "PATCH" | "DELETE" | "OPTIONS";
		signal?: AbortSignal;
		headers?: HeadersInit;
	} = {},
): Promise<T> {
	const res = await fetch(`${process.env.API}${endpoint}`, {
		signal,
		method,
		headers: {
			Authorization: token ? `Bearer ${token}` : "",
			"Content-Type": "application/json",
			"Accept": "application/json",
			...headers,
		},
		body: body ? JSON.stringify(body) : undefined,
	});
	let resBody = null;
	if (res.status !== 204) resBody = await res.json();
	if (res.ok) return resBody as T;
	else throw resBody as ApiError;
}
