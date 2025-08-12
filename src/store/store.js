import { createStore, applyMiddleware } from '@raohmaru/rtkjs/store';
import { rootReducer } from './actions';
import { logger } from './middlewares';

const docStyle = document.documentElement.style;
const initialState = JSON.parse(localStorage.getItem('state')) || {};
const enhancedCreateStore = applyMiddleware(logger)(createStore);
const store = enhancedCreateStore(rootReducer, initialState);
store.subscribe(() => {
    const state = store.getState();
    localStorage.setItem('state', JSON.stringify(state));
    docStyle.setProperty('--img-zoom', state.zoom);
    docStyle.setProperty('--img-size', `${ state.size }px`);
});

export { store };
