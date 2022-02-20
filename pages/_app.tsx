import "bootstrap/dist/css/bootstrap.min.css";
import type { AppProps } from "next/app";
import SSRProvider from "react-bootstrap/SSRProvider";
import Footer from "../components/Footer";
import NavigationBar from "../components/NavigationBar";

function MyApp({ Component, pageProps }: AppProps) {
	return (
		<SSRProvider>
			<NavigationBar />

			<Component {...pageProps} />

			<Footer />
		</SSRProvider>
	);
}

export default MyApp;
