import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './containers/App/App';
import * as serviceWorker from './serviceWorker';
import {createBrowserHistory} from 'history';
import {library} from "@fortawesome/fontawesome-svg-core";
import {faTrash, faInbox, faEnvelope, faChevronLeft, faChevronRight, faBars} from "@fortawesome/free-solid-svg-icons";
import AppWrapper from "./containers/AppWrapper/AppWrapper";
import configureStore from './store/store';
import {reducer} from './store/reducer';
import firebase from './base';
import userConfig from './base';
import {createFirestoreInstance} from "redux-firestore";

library.add(faTrash, faInbox, faEnvelope, faChevronLeft, faChevronRight, faBars)

const initialState: object = {};
const history = createBrowserHistory()
const store = configureStore({
  initialState,
  history,
})

// const store = configureStore(
//   history,
//   initialState,
// )

export const rrfProps = {
  firebase,
  config: userConfig,
  dispatch: store.dispatch,
  createFirestoreInstance
}

const app = (
  <AppWrapper
    ptStore={store}
  >
    <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons"/>
    <App/>
  </AppWrapper>
)

ReactDOM.render(app, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
