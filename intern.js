var assert = require('assert');

// internal representation of man object
function Intern() {
    this.nodes = [];
    this.state = null;
    this.paragraph;
}

Intern.prototype.addText = function (text) {
    if (!this.state) {
        this.state = 'paragraph';
    }

    if (this.state == 'paragraph') {
        if (!this.paragraph) {
            this.paragraph = {
                type: 'paragraph',
                nodes: []
            }

            this.nodes.push(this.paragraph);
        }

        this.paragraph.nodes.push({
            type: 'roman',
            text: text
        });
    }
}

Intern.prototype.addCommment = function (comment) {}

// simple macro execution
Intern.prototype.macro = function (macro, args) {
    assert(typeof macro == 'function', 'macro is a function');
    macro.call(this, args);
}

Intern.prototype.toHTML = function () {
    return '';
}

module.exports = Intern;
