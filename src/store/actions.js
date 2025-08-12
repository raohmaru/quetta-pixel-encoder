import { combineReducers } from '@raohmaru/rtkjs/store';

export function messageReducer(message, action) {
    switch (action.type) {
        case 'msg/change':
            return action.value;
        case '@@store/INIT':
            return message || 'You have discovered the secret message! This is my last FE Friday Challenge at NC. It was amazing to work with all of you during the last 10 years. You guys are the most amazing community in the company! Keep rocking and keep being awesome :D!';
        default:
            return message;
    }
}

export function zoomReducer(zoom = 1, action) {
    switch (action.type) {
        case 'zoom/change':
            return action.value;
        default:
            return zoom;
    }
}

export function sizeReducer(size = 1, action) {
    switch (action.type) {
        case 'size/change':
            return action.value;
        default:
            return size;
    }
}

export function liveReducer(live = false, action) {
    switch (action.type) {
        case 'live/change':
            return action.value;
        default:
            return live;
    }
}

const rootReducer = combineReducers({
    message: messageReducer,
    zoom: zoomReducer,
    size: sizeReducer,
    live: liveReducer
});

export { rootReducer };
