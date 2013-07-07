var Intern = require('./intern'),
    macro = require('./macro'),
    util = require('util'),
    CONTROL = '.',
    COMMENT = /^\.\\"/;

/*
 * params:
 *   input: String containing roff/troff/groff markup
 *   opt: Object with options for return value (optional)
 * returns: String containing html markup
 */
function Manolo(input, opt) {
    var ir = new Intern,
        output,
        inputLines = input.split('\n');

    inputLines.forEach(function (line) {
        var m, mFunction;

        if (commentLine(line)) {
            // TODO: separate execution flow
            return;
        }

        line = processLineEscapes(line);

        if (line.length == 0) {
            ir.addLineBreak();
        } else if (textLine(line)) {
            ir.addText(line)
        } else {
            m = macro.parse(line);
            mFunction = macro[m.command];

            if (mFunction) {
                ir.macro(mFunction, m.args);
            } else {
                console.warn('Unrecognized macro: %s', m.command);
            }
            // console.log(util.inspect(line));
        }

        ir.lineComplete();
    });

    return ir;
}

/*
 * params:
 *  line (String): a line of roff markup
 * returns: boolean -
 *   true if the string is a text line
 *   false if it's a control line
 */
function textLine(line) {
    return line.charAt(0) != CONTROL;
}

/*
 * params:
 *  line (String): a line of roff markup
 * returns: boolean -
 *   true if the string is a textline
 *   false if it's a control line
 */
function commentLine(line) {
    return COMMENT.test(line);
}

function processLineEscapes(line) {
    var matches = line.match(/\\./g);

    return line.replace(/\\\-/g, '-')
                .replace(/\\\^/g, '') // honestly, I dunno what it does
                .replace(/\\e/g, '\\');
}

module.exports = Manolo;
