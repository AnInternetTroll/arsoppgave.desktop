import { type FormEventHandler, useRef, useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import type { ApiError } from "./api_types";
import { register } from "./utils/auth";

export default function Register() {
	// This feedback is only used in this component
	// As such we don't use global state
	const [feedback, setFeedback] = useState("");
	const password2El = useRef<HTMLInputElement>();

	const onSubmit: FormEventHandler<HTMLFormElement> = (e) => {
		// The default is refresh the page pretty much
		// Not very modern
		e.preventDefault();
		const formData = new FormData(e.currentTarget);
		const password2 = formData.get("password2");
		const email = formData.get("email")! as string;
		const password = formData.get("password")! as string;
		const username = formData.get("username")! as string;
		if (password2 !== password) {
			console.log(password, password2);
			return password2El.current?.setCustomValidity(
				"Passwords don't match",
			);
		} else password2El.current?.setCustomValidity("");
		register({
			username,
			password,
			email,
		}).then(() => {
			setFeedback("Account succesfully registered");
			setTimeout(() => (location.href = "/login"), 3000);
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

			<Form.Group className="mb-3" controlId="formBasicEmail">
				<Form.Label>
					Username
				</Form.Label>
				<Form.Control
					type="text"
					placeholder="Enter username"
					name="username"
					required
				/>
				<Form.Text className="text-muted">
					This will be visible to other users
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
				<Form.Text className="text-muted">
					Make it strong ;-)
				</Form.Text>
				<br />
				<Form.Label>Repeat Password</Form.Label>
				<Form.Control
					/* @ts-ignore I think react-bootstrap's typings are bad here, otherwise idk why this would be null */
					ref={password2El}
					type="password"
					placeholder="Repeat Password"
					name="password2"
					required
				/>
			</Form.Group>
			<Button variant="primary" type="submit">
				Submit
			</Button>{" "}
			{feedback}
			<br />
		</Form>
	);
}
