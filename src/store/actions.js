import { combineReducers } from '@raohmaru/rtkjs/store';

export function messageReducer(message, action) {
    switch (action.type) {
        case 'msg/change':
            return action.value;
        case '@@store/INIT':
            return message ?? 'Ai! laurië lantar lassi súrinen, yéni únótimë ve rámar aldaron! Yéni ve lintë yuldar avánier mi oromardi lisse-miruvóreva Andúnë pella, Vardo tellumar nu luini yassen tintilar i eleni ómaryo airetári-lírinen. Sí man i yulma nin enquantuva? An sí Tintallë Varda Oiolossëo ve fanyar máryat Elentári ortanë, ar ilyë tier undulávë lumbulë; ar sindanóriello caita mornië i falmalinnar imbë met, ar hísië untúpa Calaciryo míri oialë. Sí vanwa ná, Rómello vanwa, Valimar! Namárië! Nai hiruvalyë Valimar. Nai elyë hiruva. Namárië!';
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

export function dirReducer(dir = 'ltr', action) {
    switch (action.type) {
        case 'dir/change':
            return action.value;
        default:
            return dir;
    }
}

const rootReducer = combineReducers({
    message: messageReducer,
    zoom: zoomReducer,
    size: sizeReducer,
    live: liveReducer,
    dir: dirReducer
});

export { rootReducer };
