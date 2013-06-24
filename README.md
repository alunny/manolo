# Manolo

> parse man (troff/groff) in nodejs and the browser

Manolo is a simple module for generating HTML from man files, in the (t/g)roff
typesetting format.

## Simple usage (nodejs)

    var manolo = require('manolo'),
        man = require('fs').readFileSync('man.1', 'utf8');

    console.log(manolo(man));

## API

> manolo

A single function that takes a string of (t/g)roff text as the first parameter,
and returns a string of HTML for the contents.

## License

MIT
