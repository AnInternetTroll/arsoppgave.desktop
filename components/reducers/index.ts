import { combineReducers } from "redux";
import { persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import { reducer as auth } from "./auth";

const LOCAL_STORAGE_KEY = "STATE";

export default combineReducers({
	auth: persistReducer({
		storage,
		key: LOCAL_STORAGE_KEY,
	}, auth),
});
