const fs = require('fs');
const { translate } = require('bing-translate-api');

const dictPath = './zh-to-vi-dict.json';
const dict = JSON.parse(fs.readFileSync(dictPath, 'utf8'));

const keys = Object.keys(dict);

async function run() {
    console.log(`Total keys: ${keys.length}`);
    let successCount = 0;
    for (let i = 0; i < keys.length; i++) {
        const key = keys[i];
        if (dict[key] !== "") continue;
        
        // Bing sometimes complains if the string is just punctuation or very weird characters
        if (!/[\u4e00-\u9fa5]/.test(key)) {
            dict[key] = key;
            continue;
        }

        try {
            const res = await translate(key, 'zh-Hans', 'vi');
            dict[key] = res.translation;
            successCount++;
            if (successCount % 50 === 0) {
                fs.writeFileSync(dictPath, JSON.stringify(dict, null, 2), 'utf8');
                console.log(`Progress: ${i+1}/${keys.length}`);
            }
        } catch (e) {
            console.error(`Error translating [${key}]: ${e.message}. Retrying...`);
            await new Promise(r => setTimeout(r, 2000));
            try {
                const res = await translate(key, 'zh-Hans', 'vi');
                dict[key] = res.translation;
            } catch (e2) {
                console.error(`Failed again for [${key}]. Keeping original.`);
                dict[key] = key; // Fallback to original text if translation fails
            }
        }
        await new Promise(r => setTimeout(r, 200));
    }
    fs.writeFileSync(dictPath, JSON.stringify(dict, null, 2), 'utf8');
    console.log("Translation complete!");
}

run();
