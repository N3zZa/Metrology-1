const cell = (row, text, css) => {
    const td = document.createElement('td');
    td.textContent = text;
    if (css) {
        td.className = css;
    }
    row.appendChild(td);
};
const pick = (list, index) => {
    const item = list[index];
    if (!item) {
        return ['', '', ''];
    }
    return [String(index + 1) + '.', item.name, String(item.count)];
};
function renderBase(host, metrics) {
    host.innerHTML = '';
    const rows = Math.max(metrics.operators.length, metrics.operands.length);
    for (let i = 0; i < rows; i += 1) {
        const row = document.createElement('tr');
        const left = pick(metrics.operators, i);
        const right = pick(metrics.operands, i);
        cell(row, left[0], 'idx');
        cell(row, left[1], 'name');
        cell(row, left[2], 'freq');
        cell(row, right[0], 'idx');
        cell(row, right[1], 'name');
        cell(row, right[2], 'freq');
        host.appendChild(row);
    }
    const total = document.createElement('tr');
    total.className = 'total';
    cell(total, 'η1 = ' + metrics.eta1);
    cell(total, '');
    cell(total, 'N1 = ' + metrics.n1);
    cell(total, 'η2 = ' + metrics.eta2);
    cell(total, '');
    cell(total, 'N2 = ' + metrics.n2);
    host.appendChild(total);
}
function renderExtended(host, metrics) {
    const volume = metrics.volume.toFixed(2);
    const items = [
        ['Словарь программы', 'η = η1 + η2 = ' + metrics.eta1 + ' + ' + metrics.eta2, String(metrics.eta)],
        ['Длина программы', 'N = N1 + N2 = ' + metrics.n1 + ' + ' + metrics.n2, String(metrics.length)],
        ['Объём программы', 'V = N · log₂ η = ' + metrics.length + ' · log₂ ' + metrics.eta, volume + ' бит']
    ];
    host.innerHTML = '';
    items.forEach((item) => {
        const box = document.createElement('div');
        box.className = 'metric';
        const title = document.createElement('span');
        title.className = 'metric-title';
        title.textContent = item[0];
        const formula = document.createElement('span');
        formula.className = 'metric-formula';
        formula.textContent = item[1];
        const value = document.createElement('strong');
        value.className = 'metric-value';
        value.textContent = item[2];
        box.append(title, formula, value);
        host.appendChild(box);
    });
}
