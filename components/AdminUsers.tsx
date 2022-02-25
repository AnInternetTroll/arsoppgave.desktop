import { useEffect, useState } from "react";
import Table from "react-bootstrap/Table";
import { useSelector } from "react-redux";
import type { Token, User as NormalUser } from "./api_types";
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
				</tr>
			</thead>
			<tbody>
				{users.map((user) => (
					<tr key={user.id}>
						<td>
							{user.id}
						</td>
						<td>
							{user.username}
						</td>
						<td>
							{user.email}
						</td>
						<td>
							{user.createdAt}
						</td>
					</tr>
				))}
			</tbody>
		</Table>
	);
}
