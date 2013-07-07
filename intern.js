var assert = require('assert');

// internal representation of man object
function Intern() {
    this.nodes = [];
}

Intern.prototype.addText = function (text) {
    this.current().nodes.push({ type: 'roman', text: text });
}

Intern.prototype.addCommment = function (comment) {}

Intern.prototype.addLineBreak = function () {
    this.current().nodes.push( { type: 'line-break' } );
}

// adjust state as the current node requires
Intern.prototype.lineComplete = function () {
    if (this.current().type === 'definition-term' && this.current().nodes.length) {
        this.currentTopLevel().items.push( { type: 'definition-definition', nodes: [] } )
    } else {
        // a terrible hack for now
        this.current().nodes.push({ type: 'roman', text: ' ' });
    }
}

Intern.prototype.current = function (opts) {
    var current;

    opts = opts || {};
    type = opts.type || 'paragraph';

    if (!this.nodes.length) {
        this.nodes.push( { type: type, nodes: [] } );
    }

    current = this.nodes[this.nodes.length - 1];

    if (current.items) {
        current = current.items[current.items.length - 1];
    }

    return current;
}

Intern.prototype.currentTopLevel = function () {
    return this.nodes[this.nodes.length - 1];
}

// simple macro execution
Intern.prototype.macro = function (macro, args) {
    assert(typeof macro == 'function', 'macro is a function');
    macro.call(this, args);
}

// _node must contain an array of nodes
function serialize(nodes) {
    var str = '';

    nodes.forEach(function (node) {
        switch (node.type) {
            case 'paragraph':
                str += '<p>' + serializeTexts(node.nodes) + '</p>';
                break;

            case 'section-header':
                str += '<h2>' + node.text + '</h2>';
                break;

            case 'definition-list':
                str += '<dl>' + serialize(node.items) + '</dl>';
                break;

            case 'definition-term':
                str += '<dt>' + serializeTexts(node.nodes) + '</dt>';
                break;

            case 'definition-definition':
                str += '<dd>' + serializeTexts(node.nodes) + '</dd>';
                break;

            default:
                console.warn('unhandled type ', node.type);
        }
    })

    return str;
}

function serializeTexts(nodes) {
    return nodes.map(function (node) {
        switch (node.type) {
            // yay javascript's terrible history
            case 'bold':
                return node.text.bold();

            case 'italics':
                return node.text.italics();

            case 'line-break':
                return '<br>';

            default:
                return node.text;
        }
    }).join('');

}

Intern.prototype.toHTML = function () {
    return serialize(this.nodes);
}

module.exports = Intern;
