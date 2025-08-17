import { $ } from '@raohmaru/rtkjs/dom';
import { Signal } from '@raohmaru/rtkjs/signal';

export default class Module {
    constructor($el) {
        this.$el = $el;
        this.init();
    }

    $(selector) {
        return  $(selector, this.$el);
    }

    setRefs() {
    }

    addListeners() {
    }

    init() {
        this.setRefs();
        this.addListeners();
    }

    on(event, callback) {
        if (!this.signals) {
            this.signals = new Map();
        }
        if (!this.signals.has(event)) {
            this.signals.set(event, new Signal());
        }
        const signal = this.signals.get(event);
        signal.then(callback);
        if (this._queue?.length) {
            this._queue = this._queue.filter(([queuedEvent, payload]) => {
                if (queuedEvent === event) {
                    signal.emit(...payload);
                    return false;
                }
                return true;
            });
        }
    }

    trigger(event, payload) {
        if (this.signals) {
            this.signals.get(event)?.emit(payload);
        } else {
            this.queue(event, payload);
        }
    }

    queue(event, ...payload) {
        if (!this._queue) {
            this._queue = [];
        }
        this._queue.push([event, payload]);
    }

    disable() {
        this.$fieldset.setAttribute('disabled', '');
    }

    enable() {
        this.$fieldset.removeAttribute('disabled');
    }
}
