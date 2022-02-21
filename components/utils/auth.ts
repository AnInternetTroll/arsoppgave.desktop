import { ApiError, Token, User } from "../api_types";

/**
 * A helper function to get a user from a token.
 * It may throw if the token is invalid or expired
 * @param token A valid bearer token
 * @returns The user that the token belongs to
 */
export async function getUser(token: string): Promise<User> {
	const response = await fetch(`${process.env.API}/users/@me`, {
		headers: {
			Authorization: `Bearer ${token}`,
		},
	});
	const responseData = await response.json();
	if (response.ok) return responseData as User;
	else throw responseData as ApiError;
}

/**
 * Login into a user's account with their credentials.
 * If this fails it will throw an error.
 * @param email A valid email address
 * @param password
 * @returns A token object which should be used to get a User
 */
export async function login(email: string, password: string): Promise<Token> {
	const response = await fetch(`${process.env.API}/auth/token`, {
		headers: {
			Authorization: `Basic ${btoa(`${email}:${password}`)}`,
		},
	});
	const responseData = await response.json();
	if (response.ok) return responseData as Token;
	else throw responseData as ApiError;
}
