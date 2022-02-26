import { useEffect, useState } from "react";
import { Container } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import Offcanvas from "react-bootstrap/Offcanvas";
import Table from "react-bootstrap/Table";
import { useSelector } from "react-redux";
import type { ApiError, Token, User as NormalUser } from "./api_types";
import type { State } from "./store";

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
	useEffect(() => {
		if (!token) return;
		fetch(`${process.env.API}/users`, {
			headers: {
				authorization: `Bearer ${token.token}`,
			},
		}).then(res => {
			if (res.ok) return res.json();
			else {
				throw res.json();
			}
		}).then((users: User[]) => setUsers(users)).catch(err =>
			console.error(err)
		).finally(() => setLoading(false));
	}, [setUsers, token]);
	if (!token) return <h1>No token found, please log in again</h1>;
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
	const [editable, setEditable] = useState(false);
	const [user, setUser] = useState(user2);
	const [error, setError] = useState("");

	const saveUser = () => {
		fetch(`${process.env.API}/users/${user.id}`, {
			method: "PATCH",
			headers: {
				"Content-Type": "application/json",
				authorization: `Bearer ${token?.token}`,
			},
			body: JSON.stringify(user),
		}).then(res => {
			if (res.ok) return res.json();
			else {
				throw res.json();
			}
		}).then((user: User) => setUser(user)).catch(async (err: ApiError) => {
			const error = await err;
			console.error(error);
			setError(error.message);
		});
	};

	return (
		<tr>
			{error
				? (
					<Offcanvas
						show={!!error}
						onHide={() => setError("")}
						placement="bottom"
					>
						<Container>
							<Offcanvas.Header closeButton>
								<Offcanvas.Title>
									An error has occured
								</Offcanvas.Title>
							</Offcanvas.Header>
							<Offcanvas.Body style={{ margin: 10 }}>
								{error}
							</Offcanvas.Body>
						</Container>
					</Offcanvas>
				)
				: undefined}
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
				{user.createdAt}
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
								onClick={() => setEditable(!editable)}
							>
								Cancel
							</Button>
						</>
					)
					: (
						<Button
							variant="primary"
							onClick={() => setEditable(!editable)}
						>
							Edit
						</Button>
					)}
			</td>
		</tr>
	);
}
