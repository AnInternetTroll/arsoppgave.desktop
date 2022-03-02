import { useLayoutEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import Table from "react-bootstrap/Table";
import { useSelector } from "react-redux";
import type { ApiError, Token, User as NormalUser } from "./api_types";
import { ErrorOffcanvas } from "./ErrorOffcanvas";
import type { State } from "./store";
import { getApi } from "./utils/auth";

// Admins and supers can see more than regular users
interface User extends NormalUser {
	email: string;
}

export function AdminUsers(): JSX.Element {
	const token = useSelector<State, Token | undefined>((state) =>
		state?.auth?.token
	);

	const [users, setUsers] = useState<User[]>([]);
	const [loading, setLoading] = useState(true);

	useLayoutEffect(() => {
		if (!token) return;
		getApi<User[]>("/users", {
			token: token.token,
		}).then((users) => setUsers(users)).catch(err => console.error(err))
			.finally(() => setLoading(false));
	}, [setUsers, token, setLoading]);

	if (!token) return <h1>Not logged in, please log in again</h1>;
	if (loading) return <h1>Loading...</h1>;
	if (!users.length) return <h1>No users found</h1>;

	return (
		<Table striped bordered hover>
			<thead>
				<tr>
					<th>
						#
					</th>
					<th>
						Username
					</th>
					<th>
						Email
					</th>
					<th>
						Role
					</th>
					<th>
						Date
					</th>
					<th />
				</tr>
			</thead>
			<tbody>
				{users.map((user) => <UserRow key={user.id} user={user} />)}
			</tbody>
		</Table>
	);
}

function UserRow({ user: user2 }: { user: User }) {
	const token = useSelector<State, Token | undefined>(state =>
		state?.auth?.token
	);
	const authenticatedUser = useSelector<State, NormalUser | undefined>((
		state,
	) => state?.auth?.user);

	const [editable, setEditable] = useState(false);
	const [user, setUser] = useState(user2);
	const [error, setError] = useState("");

	if (!authenticatedUser || !token) return <p>Please log in again</p>;

	const saveUser = () => {
		getApi<User>(`/users/${user.id}`, {
			method: "PATCH",
			token: token.token,
			body: JSON.stringify(user),
		}).then((user: User) => {
			setUser(user);
			setEditable(false);
		}).catch(
			async (err: Promise<ApiError>) => {
				const error = await err;
				console.error(error);
				if (error.message) setError(error.message);
				else setError("Something has gone very wrong");
			},
		);
	};

	return (
		<>
			<ErrorOffcanvas error={error} setError={setError} />
			<tr>
				<td>
					{user.id}
				</td>
				<td>
					{editable
						? (
							<input
								defaultValue={user.username}
								placeholder="User's username here"
								onChange={(e) =>
									setUser({
										...user,
										username: e.target.value,
									})}
							/>
						)
						: user.username}
				</td>
				<td>
					{user.email}
				</td>
				<td>
					{editable && authenticatedUser.role === "super"
						? (
							<select
								name="role"
								defaultValue={user.role}
								onChange={(e) =>
									setUser({
										...user,
										role: e.target.value as
											| "user"
											| "admin",
									})}
							>
								<option value="user">
									User
								</option>
								<option value="admin">
									Admin
								</option>
							</select>
						)
						: user.role}
				</td>
				<td>
					{new Date(user.createdAt).toLocaleDateString()}
				</td>
				<td>
					{editable
						? (
							<>
								<Button
									variant="success"
									onClick={saveUser}
								>
									Save
								</Button>
								{"	"}
								<Button
									variant="danger"
									onClick={() => {
										setEditable(!editable);
										setUser(user2);
									}}
								>
									Cancel
								</Button>
							</>
						)
						: (
							<Button
								variant="primary"
								disabled={user.role === "super"}
								onClick={() => setEditable(!editable)}
							>
								Edit
							</Button>
						)}
				</td>
			</tr>
		</>
	);
}
