var duetChannel = require('duet-channel');

function onclick(event) {
    if ((event.button && event.button !== 0) ||
        event.ctrlKey ||
        event.metaKey ||
        event.altKey ||
        event.shiftKey) {
        return;
    }

    var node = (function traverse (node) {
        if (node == null) {
            return;
        }

        if (node.localName !== 'a' ||
            node.href === undefined ||
            window.location.host !== node.host) {
            return traverse(node.parentNode);
        }

        if (node.hasAttribute('data-no-routing')) {
            return;
        }

        return node;
    })(event.target);

    if (node == null) {
        return;
    }

    event.preventDefault();

    channel.postMessageToWorker({
        type: 'CHANGE',
        data: node.href
    });

    window.history.pushState({}, null, node.href)
}

function onpopstate() {
    channel.postMessageToWorker({
        type: 'CHANGE',
        data: document.location.href
    });
}

function connected(counterpartName) {
    if (counterpartName !== 'main') {
        return;
    }

    window.onclick = onclick;
    window.onpopstate = onpopstate;
}

var channel = duetChannel('LOCATION', connected);

module.exports = channel;
