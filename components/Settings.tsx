import { type FormEventHandler, useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import { useDispatch, useSelector } from "react-redux";
import type { ApiError, Token, User } from "./api_types";
import { SAVE_CURRENT_USER } from "./reducers/types";
import { State } from "./store";
import { getApi } from "./utils/auth";

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
	if (!token || !user) return <p>You shouldn&apos;t be seeings this</p>;

	const onSubmit: FormEventHandler<HTMLFormElement> = (e) => {
		e.preventDefault();
		const formData = new FormData(e.currentTarget);
		getApi<User>("/users/@me", {
			method: "PATCH",
			body: {
				username: formData.get("username")!.toString(),
			},
			token: token.token,
		}).then(newUser => {
			setFeedback("Succesfully saved updates");
			dispatch({ type: SAVE_CURRENT_USER, payload: newUser });
		}).catch(async (err: ApiError) => {
			console.error(err);
			setFeedback(err.message);
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
