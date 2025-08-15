import { $ } from '@raohmaru/rtkjs/dom';

export default function log(message, $output) {
    const output = $output || $('#output');
    if (message) {
        output.classList.remove('hidden');
        output.innerHTML = `${ message }<br>`;
    } else {
        output.classList.add('hidden');
    }
}
