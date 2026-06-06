import fs from 'fs';
import path from 'path';

const logPath = './.gemini/antigravity-ide/brain/d1158182-1729-42ec-8319-aa378e3f3819/.system_generated/tasks/task-120.log';
// the base dir for the script is the desktop/ThisDat so absolute path for log is needed
const absoluteLogPath = 'C:\\Users\\43ner\\.gemini\\antigravity-ide\\brain\\d1158182-1729-42ec-8319-aa378e3f3819\\.system_generated\\tasks\\task-120.log';

const originalImage = path.join('./public/products', 'real-1mg-batch2-atorva-20-tablet.jpg');

const logData = fs.readFileSync(absoluteLogPath, 'utf8');
const lines = logData.split('\n');

for (const line of lines) {
    if (line.startsWith('Saved ')) {
        const filePath = line.substring(6).trim();
        const fullPath = path.resolve('./', filePath);
        
        console.log(`Reverting ${fullPath}`);
        fs.copyFileSync(originalImage, fullPath);
    }
}
console.log('Revert completed.');
