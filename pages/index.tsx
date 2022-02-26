import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";

export const Home: NextPage = () => {
	return (
		<>
			<Head>
				<title>
					Home
				</title>
			</Head>
			<h1>Hello, I'm Luca</h1>
			<Image src="/luca.jpeg" width={1500} height={2000} />
		</>
	);
};

export default Home;
