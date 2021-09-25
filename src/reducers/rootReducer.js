import { combineReducers } from "redux";
import mastermindReducer from "./mastermindReducer";

const rootReducer = combineReducers({
   mastermind : mastermindReducer
});

export default rootReducer;