import { store } from '../store/store';
import Module from './Module';

export default class Toolbar extends Module {
    constructor($el) {
        super($el);
    }

    setRefs() {
        this.$zoomIn = this.$('#zoom-in');
        this.$zoomOut = this.$('#zoom-out');
        this.$zoomReset = this.$('#zoom-reset');
        this.$export = this.$('#export');
    }

    addListeners() {
        this.$zoomIn.addEventListener('click', () => this.setZoom(1));
        this.$zoomOut.addEventListener('click', () => this.setZoom(-1));
        this.$zoomReset.addEventListener('click', () => this.setZoom(-Infinity));
        this.$export.addEventListener('click', () => this.signals.get('export')?.emit());
    }

    init() {
        super.init();
        this.signals = new Map();
    }

    setZoom(amount = 0) {
        let zoom = store.getState().zoom;
        zoom = Math.max(1, zoom + amount);
        store.dispatch({ type: 'zoom/change', value: zoom });
    }
}
