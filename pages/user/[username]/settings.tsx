import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import { User } from "../../../components/api_types";
import { State } from "../../../components/store";

function Settings() {
	const router = useRouter();
	const { username } = router.query;

	const user = useSelector<State, User | undefined>(state =>
		state?.auth?.user
	);

	if (!user || user.username !== username) {
		return <h1>You shouldn&apos;t be here!</h1>;
	} else return <h1>Hello, {username}</h1>;
}

export default Settings;
