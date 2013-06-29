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

macro['B'] = function (args) {
    var current = this.current(), i;

    for (i = 0; i < args.length; i++)
        current.nodes.push({ type: 'bold', text: args[i].trim() });
}

module.exports = macro;
