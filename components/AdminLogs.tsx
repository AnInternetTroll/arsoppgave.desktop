import { useLayoutEffect, useState } from "react";
import Table from "react-bootstrap/Table";
import { useSelector } from "react-redux";
import type { Log, Token } from "./api_types";
import type { State } from "./store";
import { getApi } from "./utils/auth";

export function AdminLogs(): JSX.Element {
	const token = useSelector<State, Token | undefined>((state) =>
		state?.auth?.token
	);
	const [logs, setLogs] = useState<Log[]>([]);
	const [loading, setLoading] = useState(true);

	useLayoutEffect(() => {
		if (!token) return;
		getApi<Log[]>("/logs", {
			token: token.token,
		}).then((logs) => setLogs(logs)).catch(err => {
			console.error(err);
		}).finally(() => setLoading(false));
	}, [setLogs, token, setLoading]);

	if (loading) return <h1>Loading...</h1>;
	if (!token) return <h1>No token found, please log in again</h1>;
	if (!logs.length) return <h1>No logs found</h1>;

	return (
		<Table striped bordered hover>
			<thead>
				<tr>
					<th>
						#
					</th>
					<th>
						Message
					</th>
					<th>
						Level
					</th>
					<th>
						Date
					</th>
				</tr>
			</thead>
			<tbody>
				{logs.map((log) => (
					<tr key={log.id}>
						<td>
							{log.id}
						</td>
						<td>
							{log.message}
						</td>
						<td>
							{log.level}
						</td>
						<td>
							{log.createdAt}
						</td>
					</tr>
				))}
			</tbody>
		</Table>
	);
}
