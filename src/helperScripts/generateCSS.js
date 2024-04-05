const path = require('path');
const fs = require('fs');
const projectRoot = path.resolve(__dirname, '../..'); // Переместиться на уровень выше, так как скрипт находится в подпапке

// Путь к файлу variables.scss относительно корневой директории проекта
const filePath = path.join(projectRoot, 'src', 'variables', 'variables.scss');
const generateFiledPath = path.join(projectRoot, 'src', 'variables', 'output.css')
// Чтение содержимого файла generatedVars.scss
fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
        console.log('projectRoot', projectRoot)
        console.error('Ошибка при чтении файла:', err);
        return;
    }

    // Регулярное выражение для поиска переменных в стиле SCSS
    const variableRegex = /\$([a-zA-Z0-9_-]+):\s*([^;]+);/g;

    let cssVariables = ':root {\n';

    // Использование регулярного выражения для поиска переменных и создания переменных :root
    let match;
    while ((match = variableRegex.exec(data)) !== null) {
        const [fullMatch, name, value] = match;
        cssVariables += `  --${name.trim()}: ${value.trim()};\n`;
    }

    cssVariables += '}\n';

    // Запись переменных :root в файл output.css
    fs.writeFile(generateFiledPath, cssVariables, (err) => {
        if (err) {
            console.error('Ошибка при записи файла:', err);
            return;
        }
        console.log('Файл output.css успешно создан.');
    });
});