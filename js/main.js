const byId = (id) => {
    const node = document.getElementById(id);
    if (!node) {
        throw new Error('Не найден элемент ' + id);
    }
    return node;
};
const editor = byId('source');
const statusLine = byId('status');
const tableBody = byId('base-body');
const extended = byId('extended');
const fileInput = byId('file');
const clearResult = (message) => {
    tableBody.innerHTML = '';
    extended.innerHTML = '';
    statusLine.textContent = message;
    statusLine.className = 'status warn';
};
const run = () => {
    const source = editor.value;
    if (!source.trim()) {
        clearResult('Введите или загрузите код на Groovy');
        return;
    }
    const metrics = analyze(source);
    if (metrics.eta === 0) {
        clearResult('В тексте не найдено ни операторов, ни операндов');
        return;
    }
    renderBase(tableBody, metrics);
    renderExtended(extended, metrics);
    const lines = source.replace(/\s+$/, '').split('\n').length;
    statusLine.textContent = 'Обработано строк: ' + lines +
        '; уникальных операторов: ' + metrics.eta1 +
        '; уникальных операндов: ' + metrics.eta2;
    statusLine.className = 'status ok';
};
byId('run').addEventListener('click', run);
byId('sample').addEventListener('click', () => {
    editor.value = SAMPLE;
    run();
});
byId('clear').addEventListener('click', () => {
    editor.value = '';
    clearResult('Поле очищено');
});
fileInput.addEventListener('change', () => {
    const file = fileInput.files && fileInput.files[0];
    if (!file) {
        return;
    }
    const reader = new FileReader();
    reader.onload = () => {
        editor.value = String(reader.result);
        run();
    };
    reader.readAsText(file);
    fileInput.value = '';
});
editor.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' && (event.ctrlKey || event.metaKey)) {
        event.preventDefault();
        run();
    }
});
editor.value = SAMPLE;
run();
