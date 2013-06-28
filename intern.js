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

    current.nodes.push({ type: 'roman', text: text });
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

Intern.prototype.toHTML = function () {
    return '';
}

module.exports = Intern;