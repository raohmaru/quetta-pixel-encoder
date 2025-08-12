import { $ } from '@raohmaru/rtkjs/dom';
import Form from './modules/Form';
import Toolbar from './modules/Toolbar';
import Canvas from './modules/Canvas';
import generateImage from './utils/pixelEncoder';
import log from './utils/log';
import { store } from './store/store';

function onFormSubmit(message) {
    const imageBitmap = generateImage(message);
    const { width, height} = imageBitmap;
    log(`
        Message length: ${ message.length } characters.<br>
        Image size: ${ width } x ${ height } pixels.
    `);
    canvas.$el.classList.remove('hidden');
    canvas.drawImage(imageBitmap);
    imageBitmap.close();  // Disposes of all graphical resources
    store.dispatch({ type: 'msg/change', value: message });
    store.dispatch({ type: 'size/change', value: width });
}

const unsubscribeOnInit = store.subscribe(() => {
    unsubscribeOnInit();
    const state = store.getState();
    if (state.live) {
        onFormSubmit(state.message);
    }
});

const canvas = new Canvas($('[data-cmp="Canvas"]'));
new Toolbar($('[data-cmp="Toolbar"]'))
    .on('export', () => {
        canvas.export(store.getState().message, store.getState().zoom);
    });
new Form($('[data-cmp="Form"]'))
    .on('submit', onFormSubmit);
