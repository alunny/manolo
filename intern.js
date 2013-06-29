var assert = require('assert');

// internal representation of man object
function Intern() {
    this.nodes = [];
}

Intern.prototype.addText = function (text) {
    var current = this.current();

    if (!current) {
        current = { type: 'paragraph', nodes: [] };
        this.nodes.push(current);
    }

    current.nodes.push({ type: 'roman', text: text.trim() });
}

Intern.prototype.addCommment = function (comment) {}

Intern.prototype.current = function () {
    if (this.nodes.length) {
        return this.nodes[this.nodes.length - 1];
    }
}

// simple macro execution
Intern.prototype.macro = function (macro, args) {
    assert(typeof macro == 'function', 'macro is a function');
    macro.call(this, args);
}

// _node must contain an array of nodes
function serialize(_node) {
    var str = '';

    _node.nodes.forEach(function (node) {
        switch (node.type) {
            case 'paragraph':
                str += '<p>' + serializeParagraph(node) + '</p>';
                break;

            case 'roman':
                str += node.text;
                break;

            case 'bold':
                str += node.text.bold();

            default:
                console.log('unhandled type ', node.type);
        }
    })

    return str;
}

function serializeParagraph(pg) {
    return pg.nodes.map(function (node) {
        switch (node.type) {
            // yay javascript's terrible history
            case 'bold':
                return node.text.bold();

            default:
                return node.text;
        }
    }).join(' ');

}

Intern.prototype.toHTML = function () {
    return serialize(this);
}

module.exports = Intern;
