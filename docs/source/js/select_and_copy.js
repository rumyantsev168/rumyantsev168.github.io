// original source: https://www.github.com/marcthird128/marcthird128.github.io/blob/main/docs/mazarca/assets/js/select_and_copy.js

function safe_copy() {
    let res = false;
    try {
        res = document.execCommand('copy');
    } catch (e) { console.warn("Failed to copy selected text!", e)};
    message(res ? 'Copied!' : 'Could not copy!');
};

function selectInput(element_id) {
    let node = document.getElementById(element_id).childNodes[0]
    if (document.body.createTextRange) {
        const range = document.body.createTextRange();
        range.moveToElementText(node);
        range.select();
    } else if (window.getSelection) {
        const selection = window.getSelection();
        const range = document.createRange();
        range.selectNodeContents(node);
        selection.removeAllRanges();
        selection.addRange(range);
    } else {
        console.warn("Could not select text in node: Unsupported browser.");
    };
    safe_copy();
};

function selectTextarea(textarea_id) {
    const textarea = document.getElementById(textarea_id);
    textarea.select();
    textarea.setSelectionRange(0, textarea.value.length);
    safe_copy();
};

function message(msg) {
    let els = document.getElementsByClassName('copied');
    for (let i=0; i<els.length; i++) {
        els[i].remove();
    }
    let el = document.createElement('div');
    el.className = 'copied';
    el.innerHTML = msg;
    el.onclick = () => el.remove();
    document.body.appendChild(el);
    setTimeout(() => el.remove(), 1000);
};