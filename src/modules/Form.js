import { store } from '../store/store';
import Module from './Module';
import { crc32U } from '@raohmaru/rtkjs/crc';

export default class Form extends Module {
    constructor($el) {
        super($el);
    }

    setRefs() {
        this.$message = this.$('#message');
        this.$live = this.$('#live');
        this.$fieldset = this.$('fieldset');
        this.bindTriggerMessageChange = this.triggerMessageChange.bind(this);
    }

    addListeners() {
        this.$el.addEventListener('submit', (e) => {
            e.preventDefault();
            this.triggerMessageChange();
        });
        this.$live.addEventListener('change', () => this.setLive(this.$live.checked));
    }

    init() {
        super.init();
        const { message, live} = store.getState();
        this.$message.value = message;
        this.messageCRC = crc32U(this.$message.value).toString(16);
        this.setLive(live);
    }

    setLive(enabled = false) {
        this.$live.checked = enabled;
        if (enabled) {
            this.triggerMessageChange();
            this.$message.addEventListener('keyup', this.bindTriggerMessageChange);
        } else {
            this.$message.removeEventListener('keyup', this.bindTriggerMessageChange);
        }
        store.dispatch({ type: 'live/change', value: enabled });
    }

    triggerMessageChange() {
        const { value } = this.$message;
        const crc = crc32U(value);
        // Trigger only if input text has changed.
        // Use CRC32 for memory performance to avoid comparing large chunks of text.
        if (crc !== this.messageCRC) {
            this.trigger('submit', value);
            this.messageCRC = crc;
        }
    }

    disable() {
        this.$fieldset.setAttribute('disabled', '');
    }

    enable() {
        this.$fieldset.removeAttribute('disabled');
        this.$message.focus();
    }
}
