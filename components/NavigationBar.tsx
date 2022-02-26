import Link from "next/link";
import { useRouter } from "next/router";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import { useDispatch, useSelector } from "react-redux";
import { deleteToken } from "./actions/auth";
import { Token, User } from "./api_types";
import { DELETE_CURRENT_USER } from "./reducers/types";
import { State } from "./store";

export default function NavigationBar() {
	const router = useRouter();
	const dispatch = useDispatch();
	const user = useSelector<State, User | undefined>(state =>
		state?.auth?.user
	);
	const token = useSelector<State, Token | undefined>(state =>
		state?.auth?.token
	);

	return (
		<Navbar expand="lg" collapseOnSelect bg="primary" variant="dark">
			<Container>
				<Link href="/" passHref>
					<Navbar.Brand>
						Arsoppgave
					</Navbar.Brand>
				</Link>
				<Navbar.Toggle aria-controls="responsive-navbar-nav" />
				<Navbar.Collapse>
					<Nav className="me-auto" activeKey={router.pathname}>
						<Link href="/" passHref>
							<Nav.Link>
								Home
							</Nav.Link>
						</Link>
						<Link href="/education" passHref>
							<Nav.Link disabled>
								Education
							</Nav.Link>
						</Link>
						<Link href="/experience" passHref>
							<Nav.Link disabled>
								Job Experience
							</Nav.Link>
						</Link>
					</Nav>
					<Nav activeKey={router.pathname}>
						{user && token
							// If the user is logged in
							? (
								<>
									<NavDropdown
										title={user.username}
									>
										<Link
											href={`/user/${
												encodeURIComponent(
													user.username,
												)
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
													href="/admin"
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
												deleteToken(
													dispatch,
													token?.token,
												);
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
				</Navbar.Collapse>
			</Container>
		</Navbar>
	);
}
