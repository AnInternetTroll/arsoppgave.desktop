import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import { User } from "../../../components/api_types";
import { Settings } from "../../../components/Settings";
import { State } from "../../../components/store";

function SettingsPage() {
	const router = useRouter();
	const { username } = router.query;

	const user = useSelector<State, User | undefined>(state =>
		state?.auth?.user
	);

	if (!user || user.username !== username) {
		return <h1>You shouldn&apos;t be here!</h1>;
	}

	return <Settings />;
}

export default Settings;
