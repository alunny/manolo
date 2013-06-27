var assert = require('assert');

// internal representation of man object
function Intern() {
    this.nodes = [];
    this.state = 0;
}

Intern.prototype.addText = function (text) {
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
