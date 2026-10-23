const fs = require('fs');
const https = require('https');
const path = require('path');

const dir = path.join('public', 'products', 'kids');
if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

const ids = [
  'photo-1514989940723-e8e51635b782',
  'photo-1595341888016-a392ef81b7de',
  'photo-1507464098880-e367bc5d2c08',
  'photo-1579338559194-a162d19bf842',
  'photo-1551107696-a4b085a6d91a',
  'photo-1515347619252-60a4bf4fff4f'
];

function download(url, dest) {
  return new Promise((resolve) => {
    https.get(url, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        https.get(res.headers.location, (res2) => {
          const file = fs.createWriteStream(dest);
          res2.pipe(file);
          file.on('finish', () => { file.close(); resolve(true); });
        }).on('error', () => resolve(false));
      } else if (res.statusCode === 200) {
        const file = fs.createWriteStream(dest);
        res.pipe(file);
        file.on('finish', () => { file.close(); resolve(true); });
      } else {
        resolve(false);
      }
    }).on('error', () => resolve(false));
  });
}

async function run() {
  for (let i = 0; i < ids.length; i++) {
    const url = `https://images.unsplash.com/${ids[i]}?auto=format&fit=crop&w=600&q=80`;
    const dest = path.join(dir, `kids-${i + 1}.jpg`);
    const ok = await download(url, dest);
    console.log(`kids-${i + 1}.jpg:`, ok);
  }
}

run();
