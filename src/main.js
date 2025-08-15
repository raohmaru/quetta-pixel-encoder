import { $ } from '@raohmaru/rtkjs/dom';
import { state, effect } from '@raohmaru/rtkjs/signal';
import Form from './modules/Form';
import Toolbar from './modules/Toolbar';
import Canvas from './modules/Canvas';
import generateImage from './utils/pixelEncoder';
import log from './utils/log';
import { store } from './store/store';

function onFormSubmit(message) {
    const imageBitmap = generateImage(message);
    canvas.$el.classList.remove('hidden');
    canvas.drawImage(imageBitmap);
    store.dispatch({ type: 'msg/change', value: message });
    store.dispatch({ type: 'size/change', value: imageBitmap.width });
    imageBitmap.close();  // Disposes of all graphical resources
    logStatus();
}

function logStatus() {
    const { message, size, zoom } = store.getState();
    const exportSize = size * zoom;
    log(`
        Message length: ${ message.length } characters.<br>
        Image size: ${ exportSize } x ${ exportSize } pixels (real ${ size } x ${ size }).
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
new Toolbar($('[data-cmp="Toolbar"]'))
    .on('export', () => {
        canvas.export(store.getState().message, store.getState().zoom);
    });
new Form($('[data-cmp="Form"]'))
    .on('submit', onFormSubmit);
