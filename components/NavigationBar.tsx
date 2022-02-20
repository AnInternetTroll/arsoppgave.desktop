import Link from "next/link";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";

export default function NavigationBar() {
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
					<Link href="/login" passHref>
						<Nav.Link>
							Login
						</Nav.Link>
					</Link>
				</Nav>
			</Container>
		</Navbar>
	);
}
