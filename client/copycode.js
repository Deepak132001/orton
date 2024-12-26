import fs from 'fs';
import path from 'path';

const folderPath = './src'; // Path to your src folder
const outputFile = './allCode.txt'; // Output file

const isCodeFile = (file) => /\.(js|jsx|ts|tsx|css|html)$/.test(file); // Add extensions you need

const readFiles = (dir) => {
    let code = '';
    const files = fs.readdirSync(dir);

    files.forEach((file) => {
        const fullPath = path.join(dir, file);
        const stats = fs.statSync(fullPath);

        if (stats.isDirectory()) {
            code += readFiles(fullPath); // Recursively read subfolders
        } else if (isCodeFile(file)) {
            const fileContent = fs.readFileSync(fullPath, 'utf-8');
            code += `\n// ${fullPath}\n${fileContent}\n`;
        }
    });
    return code;
};

const code = readFiles(folderPath);
fs.writeFileSync(outputFile, code, 'utf-8');

console.log(`All code has been copied to ${outputFile}`);
