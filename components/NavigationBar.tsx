import Link from "next/link";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import { useSelector } from "react-redux";
import { User } from "./api_types";
import { State } from "./store";

export default function NavigationBar() {
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
				<Nav className="me-auto">
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
				<Nav>
					{user
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
								</NavDropdown>
								<Nav.Link>
									Log out
								</Nav.Link>
							</>
						)
						: (
							<Link href="/login" passHref>
								<Nav.Link>
									Login
								</Nav.Link>
							</Link>
						)}
				</Nav>
			</Container>
		</Navbar>
	);
}
