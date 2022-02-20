import { type FormEventHandler, useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { connect, useDispatch, useSelector } from "react-redux";
import type { ApiError, Token, User } from "./api_types";
import { SAVE_TOKEN } from "./reducers/types";

export function Login({}) {
	const [feedback, setFeedback] = useState("");
	const token = useSelector(state => state.auth.token);
	const dispatch = useDispatch();

	const onSubmit: FormEventHandler<HTMLFormElement> = (e) => {
		e.preventDefault();
		const formData = new FormData(e.currentTarget);
		login(
			formData.get("email")! as string,
			formData.get("password")! as string,
		).then(token => {
			setFeedback("Logged in!");
			dispatch({ type: SAVE_TOKEN, payload: token.token });
		}).catch((err: ApiError) => {
			setFeedback("An error has occured: " + err.message);
		});
	};

	return (
		<Form onSubmit={onSubmit}>
			<Form.Group className="mb-3" controlId="formBasicEmail">
				<Form.Label>
					Email address
				</Form.Label>
				<Form.Control
					type="email"
					placeholder="Enter email"
					name="email"
					required
				/>
				<Form.Text className="text-muted">
					We&apos;ll never share your email with anyone else.
				</Form.Text>
			</Form.Group>

			<Form.Group className="mb-3" controlId="formBasicPassword">
				<Form.Label>Password</Form.Label>
				<Form.Control
					type="password"
					placeholder="Password"
					name="password"
					required
				/>
			</Form.Group>
			<Button variant="primary" type="submit">
				Submit
			</Button> {feedback}
			<br />
			Your token is {token}
		</Form>
	);
}
/**
 * Login into a user's account with their credentials.
 * If this fails it will throw an error.
 * @param email A valid email address
 * @param password
 * @returns A token object which should be used to get a User
 */
async function login(email: string, password: string): Promise<Token> {
	const response = await fetch(`${process.env.API}/auth/token`, {
		headers: {
			Authorization: `Basic ${btoa(`${email}:${password}`)}`,
		},
	});
	const responseData = await response.json();
	if (response.ok) return responseData as Token;
	else throw responseData as ApiError;
}

const mapStateToProps = state => ({
	user: state.auth.user,
});

const mapDispatchToProps = dispatch => {
	return {
		saveToken: () => dispatch(saveToken()),
		deleteToken: () => dispatch(deleteToken()),
	};
};

export default connect(mapStateToProps, mapDispatchToProps)(Login);
