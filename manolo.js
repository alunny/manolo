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
        var m;

        if (textLine(line)) {
            ir.addText(line)
            // console.log('text = %s', line);
        } else if (commentLine(line)) {
            // ir.addCommmentLine
            // console.log('comment = %s', line);
        } else {
            m = macro.parse(line)

            if (macro[m.command]) {
                macro[m.command].call(ir, m.args)
            } else {
                console.warn('Unrecognized macro: %s', m.command);
            }
            // console.log(util.inspect(line));
        }

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

module.exports = Manolo;
