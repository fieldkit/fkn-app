import 'es6-symbol/implement'

import React from 'react'
import { AppRegistry } from 'react-native'
import AppContainer from './app/containers/AppContainer'
import { Provider } from 'react-redux'
import { createStore, applyMiddleware, combineReducers, compose} from 'redux'
import thunkMiddleware from 'redux-thunk'
import { createLogger } from 'redux-logger'
import reducer from './app/reducers'
import webApiMiddleware from './app/middleware/web-api'
import deviceApiMiddleware from './app/middleware/device-api'
import createSagaMiddleware from 'redux-saga'
import { rootSaga } from './app/actions/sagas'

const loggerMiddleware = createLogger({ predicate: (getState, action) => __DEV__  });
const sagaMiddleware = createSagaMiddleware();

function configureStore(initialState) {
    const enhancer = compose(
        applyMiddleware(
            thunkMiddleware, // lets us dispatch() functions
            webApiMiddleware,
            deviceApiMiddleware,
            sagaMiddleware,
            loggerMiddleware,
        ),
    );
    return createStore(reducer, initialState, enhancer);
}

const store = configureStore({});

sagaMiddleware.run(rootSaga);

const App = () => (
    <Provider store={store}>
        <AppContainer />
    </Provider>
);

export default App;

console.ignoredYellowBox = ['Remote debugger'];

AppRegistry.registerComponent('FieldKit', () => App);
