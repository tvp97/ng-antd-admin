const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src');
const dictPath = path.join(__dirname, 'zh-to-vi-dict.json');

const dict = JSON.parse(fs.readFileSync(dictPath, 'utf8'));

// Sort keys by length descending to prevent partial replacements
const keys = Object.keys(dict).sort((a, b) => b.length - a.length);

function walk(dir) {
    let results = [];
    const list = fs.readdirSync(dir);
    list.forEach(file => {
        file = path.join(dir, file);
        const stat = fs.statSync(file);
        if (stat && stat.isDirectory()) {
            results = results.concat(walk(file));
        } else {
            if (file.endsWith('.ts')) {
                results.push(file);
            }
        }
    });
    return results;
}

const htmlFiles = walk(srcDir);
let changedFiles = 0;

htmlFiles.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    let originalContent = content;

    keys.forEach(key => {
        const val = dict[key];
        if (val && content.includes(key)) {
            // Use split and join to safely replace without regex escaping issues
            content = content.split(key).join(val);
        }
    });

    if (content !== originalContent) {
        fs.writeFileSync(file, content, 'utf8');
        changedFiles++;
    }
});

console.log(`Updated ${changedFiles} files.`);
