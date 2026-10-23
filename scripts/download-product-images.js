const fs = require('fs');
const path = require('path');
const https = require('https');

const categories = {
  "men-sandals": [
    "photo-1603808033192-082d6919d3e1",
    "photo-1562273138-f46be4ebdf33",
    "photo-1560769629-975ec94e6a86",
    "photo-1608256246200-53e635b5b65f",
    "photo-1543508282-6319a3e2621f",
    "photo-1575537302964-96cd47c06b1b"
  ],
  "men-slippers": [
    "photo-1608256246200-53e635b5b65f",
    "photo-1575537302964-96cd47c06b1b",
    "photo-1562273138-f46be4ebdf33",
    "photo-1543508282-6319a3e2621f",
    "photo-1603808033192-082d6919d3e1",
    "photo-1560769629-975ec94e6a86"
  ],
  "men-formal": [
    "photo-1614252235316-8c857d38b5f4",
    "photo-1533867617858-e7b97e060509",
    "photo-1449505278894-297fdb3edbc1",
    "photo-1543163521-1bf539c55dd2",
    "photo-1560343090-f0409e92791a",
    "photo-1549298916-b41d501d3772"
  ],
  "men-loafers": [
    "photo-1582897079496-51f1074e40e6",
    "photo-1587563871167-1ee9c731aefb",
    "photo-1597045566677-8cf032ed6634",
    "photo-1525966222134-fcfa99b8ae77",
    "photo-1614252235316-8c857d38b5f4",
    "photo-1533867617858-e7b97e060509"
  ],
  "men-boots": [
    "photo-1638247025967-b4e38f787b76",
    "photo-1520639888713-7851133b1ed0",
    "photo-1542291026-7eec264c27ff",
    "photo-1512374382149-233c42b6613c",
    "photo-1614252235316-8c857d38b5f4",
    "photo-1549298916-b41d501d3772"
  ],
  "men-sneakers": [
    "photo-1552346154-21d32810aba3",
    "photo-1595950653106-6c9ebd614d3a",
    "photo-1560769629-975ec94e6a86",
    "photo-1584735935682-2f2b69dff9d2",
    "photo-1549298916-b41d501d3772",
    "photo-1525966222134-fcfa99b8ae77"
  ],
  "women-heels": [
    "photo-1543163521-1bf539c55dd2",
    "photo-1581101767113-1677fc2beaa8",
    "photo-1535043934128-cf0b28d52f95",
    "photo-1596704017254-9b121068fb31",
    "photo-1515347619252-60a4bf4fff4f",
    "photo-1560343090-f0409e92791a"
  ],
  "women-flats": [
    "photo-1560343090-f0409e92791a",
    "photo-1535043934128-cf0b28d52f95",
    "photo-1582897079496-51f1074e40e6",
    "photo-1543163521-1bf539c55dd2",
    "photo-1581101767113-1677fc2beaa8",
    "photo-1596704017254-9b121068fb31"
  ],
  "women-sandals": [
    "photo-1562273138-f46be4ebdf33",
    "photo-1603808033192-082d6919d3e1",
    "photo-1560769629-975ec94e6a86",
    "photo-1608256246200-53e635b5b65f",
    "photo-1535043934128-cf0b28d52f95",
    "photo-1596704017254-9b121068fb31"
  ],
  "bags": [
    "photo-1584917865442-de89df76afd3",
    "photo-1590874103328-eac38a683ce7",
    "photo-1548036328-c9fa89d128fa",
    "photo-1553062407-98eeb64c6a62",
    "photo-1591561954557-26941169b49e",
    "photo-1584917865442-de89df76afd3"
  ],
  "accessories": [
    "photo-1624222247344-550fb60583dc",
    "photo-1607604276583-eef5d076aa5f",
    "photo-1553062407-98eeb64c6a62",
    "photo-1624222247344-550fb60583dc",
    "photo-1607604276583-eef5d076aa5f",
    "photo-1553062407-98eeb64c6a62"
  ]
};

function download(url, dest) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    https.get(url, (response) => {
      if (response.statusCode === 200) {
        response.pipe(file);
        file.on('finish', () => {
          file.close(() => resolve(dest));
        });
      } else {
        file.close();
        fs.unlink(dest, () => {});
        reject(new Error(`Failed with status ${response.statusCode}`));
      }
    }).on('error', (err) => {
      file.close();
      fs.unlink(dest, () => {});
      reject(err);
    });
  });
}

async function run() {
  const baseDir = path.join(__dirname, '..', 'public', 'products');
  if (!fs.existsSync(baseDir)) {
    fs.mkdirSync(baseDir, { recursive: true });
  }

  for (const [folder, ids] of Object.entries(categories)) {
    const folderPath = path.join(baseDir, folder);
    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath, { recursive: true });
    }

    console.log(`Downloading images for: ${folder}...`);
    let idx = 1;
    for (const id of ids) {
      const url = `https://images.unsplash.com/${id}?auto=format&fit=crop&w=600&q=80`;
      const dest = path.join(folderPath, `${folder}-${idx}.jpg`);
      try {
        await download(url, dest);
        console.log(`  -> Saved ${folder}-${idx}.jpg`);
      } catch (e) {
        console.warn(`  x Error on ${id}: ${e.message}`);
      }
      idx++;
    }
  }
  console.log("Download complete!");
}

run().catch(console.error);
