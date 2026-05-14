const fs = require('fs');
const env = fs.readFileSync('.env', 'utf8');
const lines = env.split('\n');
const dbUrlLine = lines.find(l => l.startsWith('DATABASE_URL='));
if (dbUrlLine) {
  const dbUrl = dbUrlLine.split('=')[1].trim();
  console.log('URL:', dbUrl);
  for (let i = 0; i < dbUrl.length; i++) {
    console.log(`Char at ${i}: ${dbUrl[i]} (Code: ${dbUrl.charCodeAt(i)})`);
  }
} else {
  console.log('DATABASE_URL line not found');
}
