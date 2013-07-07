var macro = {},
    WHITESPACE = /\s+/;

function parseArgs(argsString) {
    var args = [],
        i = 0,
        start = 0,
        inQuote = false,
        current = '';

    for (i; i < argsString.length; i++) {
        if (argsString[i] == '"') {

            if (inQuote) {
                inQuote = false;
                args.push(current);
                current = '';
            } else {
                inQuote = true;
            }

        } else if (argsString[i].match(WHITESPACE)) {

            if (inQuote) {
                current += argsString[i];
            } else {
                args.push(current);
                current = ''
            }

        } else {
            current += argsString[i];
        }
    }

    if (current.length) {
        args.push(current);
    }

    return args;
}

/*
 * input: control line calling a macro
 * output: object containing:
 *  { command: string name of the command,
 *    args: array of arguments passed to the macro }
 */
macro.parse = function (line) {
    var line = line.substr(1),
        space = line.match(WHITESPACE),
        spaceIndex, cmd, args;

    if (space) {
        spaceIndex = space.index;
        cmd = line.substr(0, spaceIndex);
        args = line.substr(spaceIndex + 1);
    } else {
        cmd = line;
        args = [];
    }

    return {
        command: cmd,
        args: parseArgs(args)
    };
}

/* (T|G)ROFF Macros */

macro.alternateText = function (first, second) {
    return function (args) {
        var current = this.current(),
            i, type = first;

        for (i=0; i < args.length; i++) {
            current.nodes.push({ type: type, text: args[i] });

            if (type == first) {
                type = second;
            } else {
                type = first;
            }
        }
    }
}

macro.singleText = function (type) {
    return function (args) {
        var current = this.current(),
            text = args.join(' ');

        current.nodes.push({ type: type, text: text });
    }
}

macro['B'] = macro.singleText('bold');

macro['I'] = macro.singleText('italics');

macro['BI'] = macro.alternateText('bold', 'italics');

macro['BR'] = macro.alternateText('bold', 'roman');

macro['IB'] = macro.alternateText('italics', 'bold');

macro['IR'] = macro.alternateText('italics', 'roman');

macro['RB'] = macro.alternateText('roman', 'bold');

macro['RI'] = macro.alternateText('roman', 'italics');

function newParagraph() {
    this.nodes.push( { type: 'paragraph', nodes: [] } );
}

macro['PP'] = newParagraph;
macro['LP'] = newParagraph;
macro['P'] = newParagraph;

// section header (h2)
macro['SH'] = function (args) {
    this.nodes.push ( { type: 'section-header', text: args[0] });
    this.nodes.push ( { type: 'paragraph', nodes: [] } );
}

// definition list (dl/dt/dd)
macro['TP'] = function (args) {
    var list;

    if (this.currentTopLevel() && this.currentTopLevel().type !== 'definition-list') {
        this.nodes.push ( { type: 'definition-list', items: [] })
    }

    list = this.currentTopLevel();
    list.items.push( { type: 'definition-term', nodes: [] } );
}

macro['br'] = function () {
    this.current().nodes.push( { type: 'line-break' } );   
}

// ABOUT - not directly translatable to DOM
macro['TH'] = function (args) {
    this.title = args[0];

    if (args.length > 1)
        this.section = args[1];
}

macro['LO'] = function (args) {
    this.section = args[0];
}

module.exports = macro;
