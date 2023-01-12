import { createStore, applyMiddleware,  } from "redux";
import thunk from 'redux-thunk'
import rootReducer from "./reducer";
import {composeWithDevTools} from 'redux-devtools-extension';

const store = createStore(rootReducer, 
//     compose(
//     applyMiddleware(thunk),
//     window.__REDUX_DeVTOOLS_EXTENSIONS__ && window.__REDUX_DeVTOOLS_EXTENSIONS__()
// )
composeWithDevTools(
    applyMiddleware(thunk)
));

export default store;