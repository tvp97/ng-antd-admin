const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src');
const dictPath = path.join(__dirname, 'zh-to-vi-dict.json');

const results = new Set();
const chineseRegex = /[\u4E00-\u9FA5]/;
// Extract consecutive non-ASCII characters, which include Chinese characters and punctuation.
const extractRegex = /[^\x00-\x7F]+/g;

function walk(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(file => {
        file = path.join(dir, file);
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) {
            results = results.concat(walk(file));
        } else {
            if (file.endsWith('.html')) {
                results.push(file);
            }
        }
    });
    return results;
}

const htmlFiles = walk(srcDir);

htmlFiles.forEach(file => {
    const content = fs.readFileSync(file, 'utf8');
    let match;
    while ((match = extractRegex.exec(content)) !== null) {
        const str = match[0].trim();
        if (chineseRegex.test(str)) {
            results.add(str);
        }
    }
});

const dict = {};
[...results].sort().forEach(str => {
    dict[str] = "";
});

fs.writeFileSync(dictPath, JSON.stringify(dict, null, 2), 'utf8');
console.log(`Extracted ${results.size} unique strings to ${dictPath}`);
