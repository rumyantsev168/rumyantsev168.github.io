function select(el) {
    selectText(el.childNodes[0])
    let res = false;
    try {
        res = document.execCommand('copy');
    } catch (e) {};
    alert(res ? 'Copied!' : 'Could not copy!');
};

function selectText(node) {
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
    }
};