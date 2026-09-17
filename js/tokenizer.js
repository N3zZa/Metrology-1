const SYMBOLS = [
    '<=>', '**=', '...', '>>>', '..<',
    '==', '!=', '<=', '>=', '&&', '||', '+=', '-=', '*=', '/=', '%=',
    '++', '--', '**', '->', '=~', '==~', '?:', '?.', '*.', '<<', '>>', '..',
    '+', '-', '*', '/', '%', '<', '>', '=', '!', '?', ':', '.', ',', ';',
    '(', ')', '[', ']', '{', '}', '&', '|', '^', '~', '@', '$'
].sort((a, b) => b.length - a.length);
const isLetter = (c) => (c >= 'a' && c <= 'z') || (c >= 'A' && c <= 'Z') || c === '_' ||
    (c >= 'Ѐ' && c <= 'ӿ');
const isDigit = (c) => c >= '0' && c <= '9';
function tokenize(source) {
    const tokens = [];
    let pos = 0;
    let line = 1;
    const push = (kind, value) => {
        tokens.push({ kind, value, line });
    };
    while (pos < source.length) {
        const ch = source[pos];
        if (ch === '\n') {
            line += 1;
            pos += 1;
            continue;
        }
        if (ch === ' ' || ch === '\t' || ch === '\r') {
            pos += 1;
            continue;
        }
        if (ch === '/' && source[pos + 1] === '/') {
            while (pos < source.length && source[pos] !== '\n') {
                pos += 1;
            }
            continue;
        }
        if (ch === '/' && source[pos + 1] === '*') {
            pos += 2;
            while (pos < source.length && !(source[pos] === '*' && source[pos + 1] === '/')) {
                if (source[pos] === '\n') {
                    line += 1;
                }
                pos += 1;
            }
            pos += 2;
            continue;
        }
        if (ch === '#' && pos === 0 && source[pos + 1] === '!') {
            while (pos < source.length && source[pos] !== '\n') {
                pos += 1;
            }
            continue;
        }
        if (ch === '"' || ch === '\'') {
            const triple = source.startsWith(ch + ch + ch, pos);
            const quote = triple ? ch + ch + ch : ch;
            const start = pos;
            pos += quote.length;
            while (pos < source.length && !source.startsWith(quote, pos)) {
                if (source[pos] === '\\') {
                    pos += 1;
                }
                if (source[pos] === '\n') {
                    line += 1;
                }
                pos += 1;
            }
            pos += quote.length;
            push('text', source.slice(start, Math.min(pos, source.length)));
            continue;
        }
        if (isDigit(ch)) {
            const start = pos;
            while (pos < source.length && (isDigit(source[pos]) || source[pos] === '_')) {
                pos += 1;
            }
            if (source[pos] === '.' && isDigit(source[pos + 1])) {
                pos += 1;
                while (pos < source.length && isDigit(source[pos])) {
                    pos += 1;
                }
            }
            if (source[pos] === 'e' || source[pos] === 'E') {
                let ahead = pos + 1;
                if (source[ahead] === '+' || source[ahead] === '-') {
                    ahead += 1;
                }
                if (isDigit(source[ahead])) {
                    pos = ahead;
                    while (pos < source.length && isDigit(source[pos])) {
                        pos += 1;
                    }
                }
            }
            if ('dDfFlLgGiI'.indexOf(source[pos]) >= 0) {
                pos += 1;
            }
            push('number', source.slice(start, pos));
            continue;
        }
        if (isLetter(ch)) {
            const start = pos;
            while (pos < source.length && (isLetter(source[pos]) || isDigit(source[pos]))) {
                pos += 1;
            }
            push('word', source.slice(start, pos));
            continue;
        }
        const symbol = SYMBOLS.find((s) => source.startsWith(s, pos));
        if (symbol) {
            push('symbol', symbol);
            pos += symbol.length;
            continue;
        }
        pos += 1;
    }
    return tokens;
}
