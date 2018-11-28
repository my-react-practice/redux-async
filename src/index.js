import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';

import thunkMiddleware from 'redux-thunk';
// import { createLogger } from 'redux-logger';
import { createStore, applyMiddleware } from 'redux';
import { selectSubreddit, fetchPostsIfNeeded } from './actions';
import rootReducer from './reducers';

import * as Sentry from '@sentry/browser';

Sentry.init({ dsn: 'https://0301bba566454e6d8f94de41386a3090@sentry.io/1332331' });

// const loggerMiddleware = createLogger();

const store = createStore(rootReducer, applyMiddleware(thunkMiddleware));

/* section 1 */

// const next = store.dispatch;
// store.dispatch = function dispatchAndLog(action) {
//   console.log('dispatching', action);
//   let result = next(action);
//   console.log('next state', store.getState());
//   return result;
// };

/* section 2 */

// function patchStoreToAddLogging(store) {
//   const next = store.dispatch;
//   store.dispatch = function dispatchAndLog(action) {
//     console.log('dispatching', action);
//     let result = next(action);
//     console.log('next state', store.getState());
//     return result;
//   };
// }

// patchStoreToAddLogging(store);

/* section 3 */

// function patchStoreToAddLogging(store) {
//   const next = store.dispatch;
//   store.dispatch = function dispatchAndLog(action) {
//     console.log('dispatching', action);
//     let result = next(action);
//     console.log('next state', store.getState());
//     return result;
//   };
// }

// function patchStoreToAddCrashReporting(store) {
//   const next = store.dispatch;
//   store.dispatch = function dispatchAndReportErrors(action) {
//     try {
//       return next(action);
//     } catch (err) {
//       console.error('Caught an exception!', err);
//       Sentry.captureException(err);
//       throw err;
//     }
//   };
// }

// patchStoreToAddLogging(store);
// patchStoreToAddCrashReporting(store);

/* section 4 */

function logger(store) {
  const next = store.dispatch;
  // store.dispatch = function dispatchAndLog(action) {
  return function dispatchAndLog(action) {
    console.log('dispatching', action);
    let result = next(action);
    console.log('next state', store.getState());
    return result;
  };
}

function crashReporter(store) {
  const next = store.dispatch;
  // store.dispatch = function dispatchAndReportErrors(action) {
  return function dispatchAndReportErrors(action) {
    try {
      return next(action);
    } catch (err) {
      console.error('Caught an exception!', err);
      Sentry.captureException(err);
      throw err;
    }
  };
}

function applyMiddlewareByMonkeypatching(store, middlewares) {
  middlewares = middlewares.slice();
  middlewares.reverse();

  middlewares.forEach(middleware => (store.dispatch = middleware(store)));
}

applyMiddlewareByMonkeypatching(store, [logger, crashReporter]);

/* section 5 */




store.dispatch(selectSubreddit('reactjs'));
store.dispatch(fetchPostsIfNeeded('reactjs')).then(() => console.log(store.getState()));

ReactDOM.render(<App />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
