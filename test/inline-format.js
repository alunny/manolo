var assert = require('assert'),
    util = require('util'),
    macro = require('./../macro'),
    Intern = require('./../intern'),
    intern, mac, paragraph;

function check(line, expected) {
    var intern = new Intern,
        mac = macro.parse(line),
        paragraph;

    intern.macro(macro[mac.command], mac.args);
    paragraph = intern.nodes[0].nodes;

    assert.deepEqual(paragraph, expected);
}

check('.B man ',
        [ { type: 'bold', text: 'man' } ]);

check('.IR section ,',
        [ { type: 'italics', text: 'section' },
          { type: 'roman', text: ',' } ])

check('.B "man /cd/foo/bar.1.gz\\fR.\\fP"',
        [ { type: 'bold', text: 'man /cd/foo/bar.1.gz' },
          { type: 'roman', text: '.' } ]);

check('.B -w \\fRor\\fP --path',
        [ { type: 'bold', text: '-w ' },
          { type: 'roman', text: 'or' },
          { type: 'bold', text: ' --path' } ]);

check('.IB topic . section\\fR,',
        [ { type: 'italics', text: 'topic' },
          { type: 'bold', text: '.' },
          { type: 'italics', text: 'section' },
          { type: 'roman', text: ',' } ]);

