export interface User {
	id: number;
	username: string;
	role: "user" | "admin" | "super";
}

export interface Token {
	id: number;
	user: number;
	exp: number;
	scope: "read" | "write" | "readwrite";
}

export interface Member {
	id: number;
	room: number;
	user: number;
}

export interface Message {
	id: number;
	/** A room ID */
	room: number;
	/** A Member ID */
	author: number;
}

export interface Room {
	id: number;
	/** A Member ID */
	owner: number;
}

export interface ApiError {
	message: string;
	/** Only available during development mode */
	stack?: string;
}
