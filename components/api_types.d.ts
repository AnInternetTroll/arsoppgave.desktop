export interface Base {
	id: number;
	createdAt: string;
	updatedAt: string;
}

export interface User extends Base {
	username: string;
	role: "user" | "admin" | "super";
}

export interface Token extends Base {
	token: string;
	exp: number;
}

export interface Member extends Base {
	room: number;
	user: number;
}

export interface Message extends Base {
	/** A room ID */
	room: number;
	/** A Member ID */
	author: number;
}

export interface Room extends Base {
	/** A Member ID */
	owner: number;
}

export interface Log extends Base {
	id: number;
	message: string;
	level: "0" | "10" | "20" | "30" | "40" | "50";
}

export interface ApiError {
	message: string;
	/** Only available during development mode */
	stack?: string;
}
