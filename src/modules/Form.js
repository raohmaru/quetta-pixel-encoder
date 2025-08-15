import { store } from '../store/store';
import Module from './Module';

export default class Form extends Module {
    constructor($el) {
        super($el);
    }

    setRefs() {
        this.$message = this.$('#message');
        this.$live = this.$('#live');
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
        this.trigger('submit', this.$message.value);
    }
}
