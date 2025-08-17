import { $ } from '@raohmaru/rtkjs/dom';
import { state, effect } from '@raohmaru/rtkjs';
import Form from './modules/Form';
import Toolbar from './modules/Toolbar';
import Canvas from './modules/Canvas';
import generateImage from './utils/pixel-encoder';
import { logStatus } from './utils/log';
import { store } from './store/store';
import topicBroker from './store/topic-broker';

async function onFormSubmit(message) {
    let width = 0;
    if (message.length > 0) {
        // Block UI if it takes too much to generate the image in the worker
        const tID = setTimeout(() => {
            topicBroker.publish('ui-disable');
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
    store.dispatch({ type: 'tale/change', value: {message, size: width} });
    logStatus(store.getState());
    topicBroker.publish('ui-enable');
}

const [zoom, setZoom] = state(store.getState().zoom);
effect(() => logStatus(store.getState()), [zoom]);

let prevState = store.getState();
store.subscribe(() => {
    const state = store.getState();
    document.documentElement.style.setProperty('--img-zoom', state.zoom);
    document.documentElement.style.setProperty('--img-size', `${ state.tale.size }px`);
    setZoom(state.zoom);
    if (state.live && state.dir !== prevState.dir) {
        onFormSubmit(state.tale.message);
    }
    prevState = state;
});

const canvasMod = new Canvas($('[data-cmp="Canvas"]'));
new Toolbar($('[data-cmp="Toolbar"]'))
    .on('export', () => {
        const { tale: {message}, zoom } = store.getState();
        canvasMod.export(message, zoom);
    });
new Form($('[data-cmp="Form"]'))
    .on('submit', onFormSubmit);
