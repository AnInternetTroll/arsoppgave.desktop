import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import LucaPic from "../public/luca.webp";

export const Home: NextPage = () => {
	return (
		<>
			<Head>
				<title>
					Home
				</title>
			</Head>
			<h1>Hello, I&apos;m Luca</h1>
			<Image
				src={LucaPic}
				width={1500}
				height={2000}
				alt="Luca looking over Oslo from the Opera"
				unoptimized
			/>
		</>
	);
};

export default Home;
