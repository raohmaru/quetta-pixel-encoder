import { createStore, applyMiddleware } from '@raohmaru/rtkjs/store';
import { rootReducer } from './actions';
import { logger } from './middlewares';

const initialState = JSON.parse(localStorage.getItem('state')) || {};
const enhancedCreateStore = applyMiddleware(logger)(createStore);
const store = enhancedCreateStore(rootReducer, initialState);
store.subscribe(() => {
    const state = store.getState();
    localStorage.setItem('state', JSON.stringify(state));
});

export { store };
