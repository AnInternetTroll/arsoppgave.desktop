import Tab from "react-bootstrap/Tab";
import Tabs from "react-bootstrap/Tabs";
import { useSelector } from "react-redux";
import { AdminLogs } from "../components/AdminLogs";
import { AdminUsers } from "../components/AdminUsers";
import { User } from "../components/api_types";
import { State } from "../components/store";

export default function AdminPage() {
	const user = useSelector<State, User | undefined>(state =>
		state?.auth?.user
	);
	if (!user || user.role === "user") {
		return <h1>You shouldn&apos;t be here</h1>;
	}
	return (
		<>
			<h1>
				Welcome, <b>{user.username}</b>, to the admin panel
			</h1>
			<Tabs defaultActiveKey="logs">
				<Tab eventKey="logs" title="Logs">
					<AdminLogs />
				</Tab>
				<Tab eventKey="users" title="Users">
					<AdminUsers />
				</Tab>
			</Tabs>
		</>
	);
}
