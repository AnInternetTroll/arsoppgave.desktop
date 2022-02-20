import "bootstrap/dist/css/bootstrap.min.css";
import type { AppProps } from "next/app";
import Container from "react-bootstrap/Container";
import Row from "react-bootstrap/Row";
import SSRProvider from "react-bootstrap/SSRProvider";
import Footer from "../components/Footer";
import NavigationBar from "../components/NavigationBar";
import { withRedux } from "../components/withReduxStore";

function MyApp({ Component, pageProps }: AppProps) {
	return (
		<SSRProvider>
			<NavigationBar />
			<Container>
				<Row>
					<Component {...pageProps} />
				</Row>
				<Footer />
			</Container>
		</SSRProvider>
	);
}

export default withRedux(MyApp);
