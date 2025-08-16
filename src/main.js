import { $ } from '@raohmaru/rtkjs/dom';
import { state, effect } from '@raohmaru/rtkjs/signal';
import Form from './modules/Form';
import Toolbar from './modules/Toolbar';
import Canvas from './modules/Canvas';
import generateImage from './utils/pixel-encoder';
import log from './utils/log';
import { store } from './store/store';

async function onFormSubmit(message) {
    let width = 0;
    if (message.length > 0) {
        // Block UI if it takes too much to generate the image in the worker
        const tID = setTimeout(() => {
            formMod.disable();
            toolbarMod.disable();
        }, 100);
        try {
            const imageBitmap = await generateImage(message);
            canvasMod.$el.classList.remove('hidden');
            canvasMod.drawImage(imageBitmap, store.getState().dir);
            width = imageBitmap.width;
            imageBitmap.close();  // Disposes of all graphical resources
        } catch(err) {
            log(`
                It is taking too much times for the quendi to encode your tale.<br>
                Please try reducing the amount of characters.
            `);
        }
        clearTimeout(tID);
    }
    store.dispatch({ type: 'msg/change', value: message });
    store.dispatch({ type: 'size/change', value: width });
    logStatus();
    formMod.enable();
    toolbarMod.enable();
}

function logStatus() {
    const { message, size, zoom } = store.getState();
    const exportSize = size * zoom;
    const realSize = exportSize !== size ? ` (real ${ size } x ${ size }` : '';
    log(`
        Message length: ${ message.length } characters.<br>
        Image size: ${ exportSize } x ${ exportSize } pixels${realSize}).
    `);
}

const [zoom, setZoom] = state(store.getState().zoom);
effect(logStatus, [zoom]);

let prevState = store.getState();
store.subscribe(() => {
    const state = store.getState();
    document.documentElement.style.setProperty('--img-zoom', state.zoom);
    document.documentElement.style.setProperty('--img-size', `${ state.size }px`);
    setZoom(state.zoom);
    if (state.live && state.dir !== prevState.dir) {
        onFormSubmit(state.message);
    }
    prevState = state;
});

const canvasMod = new Canvas($('[data-cmp="Canvas"]'));
const toolbarMod = new Toolbar($('[data-cmp="Toolbar"]'));
toolbarMod.on('export', () => {
    canvasMod.export(store.getState().message, store.getState().zoom);
});
const formMod = new Form($('[data-cmp="Form"]'));
formMod.on('submit', onFormSubmit);
