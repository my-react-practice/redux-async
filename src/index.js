import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';

// import thunkMiddleware from 'redux-thunk';
// import { createLogger } from 'redux-logger';
import { createStore, applyMiddleware } from 'redux';
import { selectSubreddit, fetchPostsIfNeeded } from './actions';
import rootReducer from './reducers';

import * as Sentry from '@sentry/browser';

Sentry.init({ dsn: 'https://0301bba566454e6d8f94de41386a3090@sentry.io/1332331' });

// const loggerMiddleware = createLogger();

// const store = createStore(rootReducer, applyMiddleware(thunkMiddleware, loggerMiddleware));

/* Attempt 1 */

// const next = store.dispatch;
// store.dispatch = function dispatchAndLog(action) {
//   console.log('dispatching', action);
//   let result = next(action);
//   console.log('next state', store.getState());
//   return result;
// };

/* Attempt 2 */

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

/* Attempt 3 */

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

/* Attempt 4 */

// function logger(store) {
//   const next = store.dispatch;
//   // store.dispatch = function dispatchAndLog(action) {
//   return function dispatchAndLog(action) {
//     console.log('dispatching', action);
//     let result = next(action);
//     console.log('next state', store.getState());
//     return result;
//   };
// }

// function crashReporter(store) {
//   const next = store.dispatch;
//   // store.dispatch = function dispatchAndReportErrors(action) {
//   return function dispatchAndReportErrors(action) {
//     try {
//       return next(action);
//     } catch (err) {
//       console.error('Caught an exception!', err);
//       Sentry.captureException(err);
//       throw err;
//     }
//   };
// }

// function applyMiddlewareByMonkeypatching(store, middlewares) {
//   middlewares = middlewares.slice();
//   middlewares.reverse();

//   middlewares.forEach(middleware => (store.dispatch = middleware(store)));
// }

// applyMiddlewareByMonkeypatching(store, [logger, crashReporter]);

/* Attempt 5 */
const logger = store => next => action => {
  console.log('prev state', store.getState());
  console.log('dispatching', action);
  let result = next(action);
  console.log('next state', store.getState());
  return result;
};

const crashReporter = ({ dispatch, getState }) => next => action => {
  try {
    if (typeof action === 'function') {
      return action(dispatch, getState);
    } else {
      return next(action);
    }
  } catch (err) {
    console.error('Caught an exception!', err);
    Sentry.captureException(err);
    throw err;
  }
};

// function applyMiddlewareByMonkeypatching(store, middlewares) {
//   middlewares = middlewares.slice()
//   middlewares.reverse()
//   let dispatch = store.dispatch
//   middlewares.forEach(middleware => (dispatch = middleware(store)(dispatch)))
//   return Object.assign({}, store, { dispatch })
// }

const store = createStore(rootReducer, applyMiddleware(logger, crashReporter));

store.dispatch(selectSubreddit('reactjs'));
store.dispatch(fetchPostsIfNeeded('reactjs')).then(() => console.log(store.getState()));

ReactDOM.render(<App />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
