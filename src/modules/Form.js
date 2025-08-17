import { crc32U } from '@raohmaru/rtkjs/crc';
import { store } from '../store/store';
import { isTouchDevice } from '../utils/media';
import Module from './Module';
import topicBroker from '../store/topic-broker';

export default class Form extends Module {
    constructor($el) {
        super($el);
    }

    setRefs() {
        this.$message = this.$('#message');
        this.$live = this.$('#live');
        this.$fieldset = this.$('fieldset');
        this.$dir = this.$('#dir');
        this.bindTriggerMessageChange = this.triggerMessageChange.bind(this);
    }

    addListeners() {
        this.$el.addEventListener('submit', (e) => {
            e.preventDefault();
            this.triggerMessageChange();
        });
        this.$live.addEventListener('change', () => this.setLive(this.$live.checked));
        this.$dir.addEventListener('change', () => this.changeWritingDirection(this.$dir.value));
        topicBroker.subscribe('ui-enable', this.enable.bind(this));
        topicBroker.subscribe('ui-disable', this.disable.bind(this));
    }

    init() {
        super.init();
        const { tale: {message}, live, dir } = store.getState();
        this.$message.value = message;
        this.$dir.value = dir;
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

    triggerMessageChange(e) {
        if (e?.type === 'keyup' && isTouchDevice()) {
            return;
        }
        const { value } = this.$message;
        const crc = crc32U(value);
        // Trigger only if input text has changed.
        // Use CRC32 for performance to avoid comparing large chunks of text.
        if (crc !== this.messageCRC) {
            this.trigger('submit', value);
            this.messageCRC = crc;
        }
    }

    changeWritingDirection(dir) {
        this.messageCRC = 0;
        store.dispatch({ type: 'dir/change', value: dir });
    }

    enable() {
        super.enable();
        if (this.$live.checked && !isTouchDevice()) {
            this.$message.focus();
        }
    }
}
