var assert = require('assert'),
    util = require('util'),
    macro = require('./../macro');

function check(line, expected) {
    var parsed = macro.parse(line);

    try {
        assert.deepEqual(parsed, expected, line);

    } catch (e) {
        if (e instanceof assert.AssertionError) {
            console.log(util.inspect(parsed));
            console.log(util.inspect(expected));
        }

        throw e;
    }
}

check('.LO 1',
        { command: 'LO', args: ['1']});

check('.RB [ --path ] ',
        { command: 'RB', args: ['[', '--path', ']'] });

check('.TH man 1 "September 19, 2005"',
        { command: 'TH', args: ['man', '1', 'September 19, 2005' ]});
