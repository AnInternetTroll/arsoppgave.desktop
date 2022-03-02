import type { Dispatch, SetStateAction } from "react";
import Container from "react-bootstrap/Container";
import Offcanvas from "react-bootstrap/Offcanvas";

export function ErrorOffcanvas(
	{ error, setError }: {
		error: string;
		setError: Dispatch<SetStateAction<string>>;
	},
) {
	if (!error) return <span />;
	return (
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
	);
}
