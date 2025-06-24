const fs = require('fs');
const path = require('path');

const markupFileDirectoryPath = './public/techs';
const techsJsonPath = './src/data/techs.json'
const statsJsonPath = './src/data/stats.json'



// --- Step 1: Read all .md files ---
const files = fs.readdirSync(markupFileDirectoryPath).filter(f => f.endsWith('.md'));

// --- Step 2: Group numbered slide files ---
const slideGroups = new Map();
for (const file of files) {
    const match = /^(.+)-(\d+)\.md$/.exec(file);
    if (match) {
        const base = match[1];
        const index = parseInt(match[2], 10);
        if (!slideGroups.has(base)) {
			slideGroups.set(base, []);
		}
        slideGroups.get(base).push({ file, index });
    }
}

// --- Step 3: Generate combined .md files ---
for (const [base, parts] of slideGroups.entries()) {
    if (parts.length > 1) {
        const outputFile = path.join(markupFileDirectoryPath, `${base}.md`);
        parts.sort((a, b) => a.index - b.index);

        const combinedContent = parts
            .map(p => fs.readFileSync(path.join(markupFileDirectoryPath, p.file), 'utf-8'))
            .join('\n');

        fs.writeFileSync(outputFile, combinedContent, 'utf-8');
        console.log(`✅ Generated ${base}.md`);
    }
}

// --- Step 4: Read and parse techs.json ---
let techs = [];
try {
    techs = JSON.parse(fs.readFileSync(techsJsonPath, 'utf-8'));
} catch (err) {
    console.error('❌ Failed to read techs.json:', err);
    process.exit(1);
}

// --- Step 5: Update slideAmount for known entries ---
const knownNames = new Set(techs.map(t => t.markupFileName));

for (const tech of techs) {
    const name = tech.markupFileName;
	if (name === 'overview') { // ignore
		continue;
	}
    if (slideGroups.has(name)) {
        const newAmount = slideGroups.get(name).length;
        tech.slideAmount = newAmount;
    } else {
        console.error(`⚠️  No slides found for '${name}' but there is an entry in techs.json`);
    }
}

// --- Step 6: Log unexpected slide groups not in techs.json ---
for (const [name] of slideGroups.entries()) {
    if (!knownNames.has(name)) {
        console.error(`⚠️  Slides exist for '${name}', but it's not in techs.json`);
    }
}

// --- Step 7: Save updated techs.json ---
fs.writeFileSync(techsJsonPath, JSON.stringify(techs, null, 4), 'utf-8');
console.log('✅ techs.json slide amounts updated.');

// --- Step 8: Load, update date and save stats.json ---
let stats = [];
try {
    stats = JSON.parse(fs.readFileSync(statsJsonPath, 'utf-8'));
} catch (err) {
    console.error('❌ Failed to read stats.json:', err);
    process.exit(1);
}

const today = new Date();
const parts = new Intl.DateTimeFormat('en-GB', {
  day: 'numeric',
  month: 'long',
  year: 'numeric'
}).formatToParts(today);
const formattedDate = `${parts.find(p => p.type === 'day').value}. ${parts.find(p => p.type === 'month').value} ${parts.find(p => p.type === 'year').value}`;

stats.lastUpdated = formattedDate;

fs.writeFileSync(statsJsonPath, JSON.stringify(stats, null, 4), 'utf-8');
console.log('✅ stats.json slide amounts updated.');