import { createStore, combineReducers, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import { affectationsReducer } from "./reducers/affectationsReducer";
import { craReducer } from "./reducers/craReducer";
import userReducer from "./reducers/userReducer";

const composedEnhancer = applyMiddleware(thunk)

export const store = createStore(
          combineReducers({
                    user: userReducer,
                    affectations: affectationsReducer,
                    cras: craReducer
          }),
          composedEnhancer
)