import { type FormEventHandler, useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { useDispatch, useSelector } from "react-redux";
import type { ApiError, Token, User } from "./api_types";
import { SAVE_CURRENT_USER } from "./reducers/types";
import { State } from "./store";

/**
 * USER MUST BE LOGGED IN TO SEE THIS
 * @returns A settings form
 */
export function Settings() {
	const token = useSelector<State, Token | undefined>(state =>
		state?.auth?.token
	);
	const user = useSelector<State, User | undefined>(state =>
		state?.auth?.user
	);
	const [feedback, setFeedback] = useState("");
	const dispatch = useDispatch();
	if (!token || !user) return <p>You shouldn't be seeings this</p>;

	const onSubmit: FormEventHandler<HTMLFormElement> = (e) => {
		e.preventDefault();
		const formData = new FormData(e.currentTarget);
		fetch(`${process.env.API}/users/@me`, {
			method: "PATCH",
			headers: {
				Authorization: `Bearer ${token.token}`,
				"Content-Type": "application/json",
			},
			body: JSON.stringify({
				username: formData.get("username"),
			}),
		}).then(res => {
			if (res.ok) return res.json();
			else throw res.json();
		}).then(newUser => {
			setFeedback("Succesfully saved updates");
			dispatch({ type: SAVE_CURRENT_USER, payload: newUser });
		}).catch(async (err: Promise<ApiError>) => {
			try {
				const error = await err;
				if (error.message) {
					return setFeedback(error.message);
				}
			} catch (e) {
				console.error("Error during JSON parsing", e);
			}
			console.error(err);
			setFeedback("An error has occured, please report this to an admin");
		});
	};

	return (
		<Form onSubmit={onSubmit}>
			<Form.Group>
				<Form.Label>
					Username
				</Form.Label>
				<Form.Control
					type="text"
					placeholder="Enter your new username here"
					name="username"
					defaultValue={user.username}
					required
				/>
			</Form.Group>
			<Button variant="primary" type="submit">
				Submit
			</Button>{" "}
			{feedback}
		</Form>
	);
}
