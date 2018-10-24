import { createStore, compose, applyMiddleware } from 'redux';
import { createEpicMiddleware } from 'redux-observable';
import rootReducer from './reducers';
import { cityEpic } from './epics/citiesEpic';

// set up our composeEnhancers function, baed on the existence of the
// DevTools extension when creating the store
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const epicMiddleware = createEpicMiddleware();

const initialState = {
  choices: ['Madrid', 'Havana', 'New York'],
  loading: false,
  error: undefined,
  city: '',
  data: {}
};

const store = createStore(
  rootReducer,
  initialState,
  composeEnhancers(applyMiddleware(epicMiddleware))
);

// order matters
epicMiddleware.run(cityEpic);

export default store;
