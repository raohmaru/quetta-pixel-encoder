import { $ } from '@raohmaru/rtkjs/dom';

export function log(message, $output) {
    const output = $output || $('#output');
    if (message) {
        output.classList.remove('hidden');
        output.innerHTML = `${ message }<br>`;
    } else {
        output.classList.add('hidden');
    }
}

export function logStatus(state) {
    const { tale: {message, size}, zoom } = state;
    const exportSize = size * zoom;
    const realSize = exportSize !== size ? ` (real ${ size } x ${ size }` : '';
    log(`
        Message length: ${ message.length } characters.<br>
        Image size: ${ exportSize } x ${ exportSize } px${realSize}).
    `);
}
