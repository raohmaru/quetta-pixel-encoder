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
        this.signals.get(event).then(callback);
    }
}
