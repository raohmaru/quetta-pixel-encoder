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
            form.disable();
            toolbar.disable();
        }, 100);
        try {
            const imageBitmap = await generateImage(message);
            canvas.$el.classList.remove('hidden');
            canvas.drawImage(imageBitmap);
            width = imageBitmap.width;
            imageBitmap.close();  // Disposes of all graphical resources
        } catch(err) {
            log(`
                It is taking too much times to the quendi to encode your tale.<br>
                Please try reducing the amount of characters.
            `);
        }
        clearTimeout(tID);
    }
    store.dispatch({ type: 'msg/change', value: message });
    store.dispatch({ type: 'size/change', value: width });
    logStatus();
    form.enable();
    toolbar.enable();
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

store.subscribe(() => {
    const { zoom, size } = store.getState();
    document.documentElement.style.setProperty('--img-zoom', zoom);
    document.documentElement.style.setProperty('--img-size', `${ size }px`);
    setZoom(zoom);
});

const canvas = new Canvas($('[data-cmp="Canvas"]'));
const toolbar = new Toolbar($('[data-cmp="Toolbar"]'));
toolbar.on('export', () => {
    canvas.export(store.getState().message, store.getState().zoom);
});
const form = new Form($('[data-cmp="Form"]'));
form.on('submit', onFormSubmit);
