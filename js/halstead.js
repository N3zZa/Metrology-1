const CONTROL = {
    if: 'if…else',
    switch: 'switch…case…default',
    while: 'while…do',
    for: 'for…in…do',
    do: 'do…while',
    try: 'try…catch…finally',
    return: 'return',
    break: 'break',
    continue: 'continue',
    throw: 'throw',
    assert: 'assert',
    instanceof: 'instanceof',
    as: 'as'
};
const ABSORBED = new Set(['else', 'case', 'default', 'catch', 'finally', 'new', 'in']);
const COMMANDS = new Set(['println', 'print', 'printf']);
const SKIPPED = new Set([
    'def', 'class', 'interface', 'enum', 'trait', 'package', 'import',
    'public', 'private', 'protected', 'static', 'final', 'abstract',
    'void', 'int', 'long', 'short', 'byte', 'float', 'double', 'char',
    'boolean', 'String', 'Object', 'List', 'Map', 'Set', 'BigDecimal',
    'extends', 'implements', 'this', 'super'
]);
const LITERAL_WORDS = new Set(['true', 'false', 'null']);
const DECLARATORS = new Set(['new', 'class', 'interface', 'enum', 'trait', 'import', 'package', 'extends', 'implements']);
const PAIRS = {
    '(': '( )',
    '[': '[ ]',
    '{': '{ }'
};
const CLOSERS = new Set([')', ']', '}']);
const isTypeName = (token, next) => {
    if (!next || next.kind !== 'word') {
        return false;
    }
    if (SKIPPED.has(next.value) || CONTROL[next.value] || ABSORBED.has(next.value)) {
        return false;
    }
    const head = token.value[0];
    return head === head.toUpperCase() && head !== head.toLowerCase();
};
class Counter {
    constructor() {
        this.map = new Map();
    }
    add(name) {
        this.map.set(name, (this.map.get(name) ?? 0) + 1);
    }
    entries() {
        return [...this.map.entries()]
            .map(([name, count]) => ({ name, count }))
            .sort((a, b) => (b.count - a.count) || a.name.localeCompare(b.name, 'ru'));
    }
    total() {
        let sum = 0;
        this.map.forEach((value) => {
            sum += value;
        });
        return sum;
    }
}
function analyze(source) {
    const tokens = tokenize(source);
    const operators = new Counter();
    const operands = new Counter();
    for (let i = 0; i < tokens.length; i += 1) {
        const token = tokens[i];
        const next = tokens[i + 1];
        const prev = tokens[i - 1];
        if (token.kind === 'number' || token.kind === 'text') {
            operands.add(token.value);
            continue;
        }
        if (token.kind === 'word') {
            const afterDot = prev !== undefined && prev.kind === 'symbol' &&
                (prev.value === '.' || prev.value === '?.' || prev.value === '*.');
            if (!afterDot) {
                const control = CONTROL[token.value];
                if (control) {
                    operators.add(control);
                    continue;
                }
                if (ABSORBED.has(token.value) || SKIPPED.has(token.value)) {
                    continue;
                }
            }
            const opensCall = next !== undefined && next.kind === 'symbol' && next.value === '(';
            const opensClosure = afterDot && next !== undefined && next.kind === 'symbol' && next.value === '{';
            if (opensCall || opensClosure || COMMANDS.has(token.value)) {
                operators.add(token.value + '( )');
                if (opensCall) {
                    i += 1;
                }
                continue;
            }
            if (afterDot) {
                operands.add(token.value);
                continue;
            }
            if (LITERAL_WORDS.has(token.value)) {
                operands.add(token.value);
                continue;
            }
            if (prev !== undefined && prev.kind === 'word' && DECLARATORS.has(prev.value)) {
                continue;
            }
            if (isTypeName(token, next)) {
                continue;
            }
            operands.add(token.value);
            continue;
        }
        if (CLOSERS.has(token.value)) {
            continue;
        }
        const pair = PAIRS[token.value];
        if (pair) {
            operators.add(pair);
            continue;
        }
        if (token.value === '$') {
            continue;
        }
        operators.add(token.value);
    }
    const operatorList = operators.entries();
    const operandList = operands.entries();
    const eta1 = operatorList.length;
    const eta2 = operandList.length;
    const n1 = operators.total();
    const n2 = operands.total();
    const eta = eta1 + eta2;
    const length = n1 + n2;
    return {
        operators: operatorList,
        operands: operandList,
        eta1,
        eta2,
        n1,
        n2,
        eta,
        length,
        volume: eta > 0 ? length * Math.log2(eta) : 0
    };
}
