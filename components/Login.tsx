import { type FormEventHandler, useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { useDispatch, useSelector } from "react-redux";
import type { ApiError, Token } from "./api_types";
import { SAVE_CURRENT_USER, SAVE_TOKEN } from "./reducers/types";
import { State } from "./store";
import { getUser, login } from "./utils/auth";

export default function Login() {
	// This feedback is only used in this component
	// As such we don't use global state
	const [feedback, setFeedback] = useState("");

	const token = useSelector<State, Token | undefined>(state =>
		state?.auth?.token
	);
	const dispatch = useDispatch();

	const onSubmit: FormEventHandler<HTMLFormElement> = (e) => {
		// The default is refresh the page pretty much
		// Not very modern
		e.preventDefault();
		const formData = new FormData(e.currentTarget);
		login(
			// Since we added `requred` to the input elements
			// We know for sure email and password will be here
			formData.get("email")! as string,
			formData.get("password")! as string,
		).then(token => {
			setFeedback("Logged in!");
			// Save token to global state
			// Which also saves it in localStorage
			dispatch({ type: SAVE_TOKEN, payload: token });

			getUser({ token: token.token }).then((user) => {
				dispatch({ type: SAVE_CURRENT_USER, payload: user });
				setFeedback(`Welcome ${user.username}`);
			});
		}).catch((err: ApiError) => {
			// We are pretty much asserting that ApiError is actually an ApiError
			// We never know with the wacko who's working on the backend
			if (err.message) setFeedback(err.message);
			else {
				console.error(err);
				setFeedback(
					"Something terrible has happened, check console and report this to the admin",
				);
			}
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
			</Button>{" "}
			{feedback}
			<br />
			Your token is {token?.token}
		</Form>
	);
}
