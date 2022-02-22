import Link from "next/link";
import { useRouter } from "next/router";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import { useDispatch, useSelector } from "react-redux";
import { User } from "./api_types";
import { DELETE_CURRENT_USER, DELETE_TOKEN } from "./reducers/types";
import { State } from "./store";

export default function NavigationBar() {
	const router = useRouter();
	const dispatch = useDispatch();
	const user = useSelector<State, User | undefined>(state =>
		state?.auth?.user
	);

	return (
		<Navbar bg="primary" variant="dark">
			<Container>
				<Link href="/" passHref>
					<Navbar.Brand>
						Arsoppgave
					</Navbar.Brand>
				</Link>
				<Nav className="me-auto" activeKey={router.pathname}>
					<Link href="/" passHref>
						<Nav.Link>
							Home
						</Nav.Link>
					</Link>
					<Link href="/education" passHref>
						<Nav.Link>
							Education
						</Nav.Link>
					</Link>
					<Link href="/experience" passHref>
						<Nav.Link>
							Job Experience
						</Nav.Link>
					</Link>
				</Nav>
				<Nav activeKey={router.pathname}>
					{user
						// If the user is logged in
						? (
							<>
								<NavDropdown
									title={user.username}
								>
									<Link
										href={`/user/${
											encodeURIComponent(user.username)
										}/settings`}
										passHref
									>
										<NavDropdown.Item>
											Settings
										</NavDropdown.Item>
									</Link>
									{user.role === "super" ||
											user.role === "admin"
										? (
											<Link
												href={`/admin`}
												passHref
											>
												<NavDropdown.Item>
													Admin panel
												</NavDropdown.Item>
											</Link>
										)
										: undefined}
								</NavDropdown>
								<Nav.Link>
									<span
										onClick={() => {
											dispatch({ type: DELETE_TOKEN });
											dispatch({
												type: DELETE_CURRENT_USER,
											});
										}}
									>
										Log out
									</span>
								</Nav.Link>
							</>
						)
						: (
							// If no user is logged in
							<>
								<Link href="/login" passHref>
									<Nav.Link>
										Log in
									</Nav.Link>
								</Link>
								<Link href="/register" passHref>
									<Nav.Link>
										Create Account!
									</Nav.Link>
								</Link>
							</>
						)}
				</Nav>
			</Container>
		</Navbar>
	);
}
