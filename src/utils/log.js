import { $ } from '@raohmaru/rtkjs/dom';

export default function log(message, $output) {
    const output = $output || $('#output');
    output.innerHTML = `${ message }<br>`;
}
