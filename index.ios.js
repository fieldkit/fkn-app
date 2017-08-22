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

const loggerMiddleware = createLogger({ predicate: (getState, action) => __DEV__  });

function configureStore(initialState) {
    const enhancer = compose(
        applyMiddleware(
            thunkMiddleware, // lets us dispatch() functions
            webApiMiddleware,
            deviceApiMiddleware,
            loggerMiddleware,
        ),
    );
    return createStore(reducer, initialState, enhancer)
}

const store = configureStore({});

const App = () => (
    <Provider store={store}>
        <AppContainer />
    </Provider>
)

AppRegistry.registerComponent('FieldKit', () => App)
