import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';

import './index.scss';
import rootReducer from './store/reducers';
import App from './App';


const middleWare = [thunk];

const store = createStore(
  rootReducer,
  applyMiddleware(...middleWare)
);

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);
