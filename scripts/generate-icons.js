const fs = require('fs');
const zlib = require('zlib');

function crc32(buf) {
  let c;
  const table = [];
  for (let n = 0; n < 256; n++) {
    c = n;
    for (let k = 0; k < 8; k++) {
      c = ((c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1));
    }
    table[n] = c;
  }
  let crc = 0 ^ (-1);
  for (let i = 0; i < buf.length; i++) {
    crc = (crc >>> 8) ^ table[(crc ^ buf[i]) & 0xFF];
  }
  return (crc ^ (-1)) >>> 0;
}

function makeChunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length, 0);
  const typeBuf = Buffer.from(type, 'ascii');
  const crcBuf = Buffer.alloc(4);
  const toCrc = Buffer.concat([typeBuf, data]);
  crcBuf.writeUInt32BE(crc32(toCrc), 0);
  return Buffer.concat([len, typeBuf, data, crcBuf]);
}

function generateAppIcon(size, outPath) {
  const width = size;
  const height = size;
  const rawData = Buffer.alloc(height * (1 + width * 4));

  const gold = [212, 175, 55, 255]; // #D4AF37
  const goldLight = [245, 225, 120, 255]; // #F5E178
  const bg = [8, 8, 8, 255]; // #080808
  const borderCol = [42, 42, 42, 255];

  let offset = 0;
  const cx = width / 2;
  const cy = height / 2;
  const radius = width * 0.46;

  for (let y = 0; y < height; y++) {
    rawData[offset++] = 0; // Filter byte: None
    for (let x = 0; x < width; x++) {
      const dx = x - cx;
      const dy = y - cy;
      const dist = Math.sqrt(dx * dx + dy * dy);

      let color = bg;

      // Outer gold circle ring
      if (dist >= radius - 3 && dist <= radius) {
        color = gold;
      } else if (dist < radius - 3 && dist > radius - 6) {
        color = [30, 30, 30, 255];
      }

      // Crown / Diamond Luxury Monogram
      // Crown points: (cx - w*0.25, cy - h*0.05), (cx - w*0.12, cy - h*0.18), (cx, cy - h*0.25), (cx + w*0.12, cy - h*0.18), (cx + w*0.25, cy - h*0.05)
      // Base: cy + h*0.05
      const crownTop = cy - height * 0.22;
      const crownBase = cy + height * 0.08;
      const crownWidth = width * 0.28;

      if (y >= crownTop && y <= crownBase && Math.abs(dx) <= crownWidth) {
        // Draw Royal Crown
        const normX = dx / crownWidth; // -1 to 1
        const normY = (y - crownTop) / (crownBase - crownTop); // 0 to 1

        // Crown peaks shape
        const peakY = 0.45 * Math.cos(normX * Math.PI * 2.5);
        if (normY >= 0.25 - peakY && normY <= 0.85) {
          color = (Math.abs(normX) < 0.1 || Math.abs(Math.abs(normX) - 0.7) < 0.1) ? goldLight : gold;
        } else if (normY > 0.88 && normY <= 0.98) {
          // Crown base band
          color = gold;
        }
      }

      // Monogram "ROYAL" band under crown
      const bandY = cy + height * 0.14;
      const bandHeight = height * 0.12;
      if (y >= bandY && y <= bandY + bandHeight && Math.abs(dx) <= width * 0.32) {
        // "R" letter shape
        const rx = dx + width * 0.08;
        const ry = y - bandY;
        // simple high-contrast monogram block
        if (y >= bandY + bandHeight * 0.4 && y <= bandY + bandHeight * 0.55 && Math.abs(dx) <= width * 0.28) {
          color = gold;
        }
      }

      rawData[offset++] = color[0];
      rawData[offset++] = color[1];
      rawData[offset++] = color[2];
      rawData[offset++] = color[3];
    }
  }

  const deflated = zlib.deflateSync(rawData);

  const header = Buffer.from([0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A]);
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8; // 8 bits per channel
  ihdr[9] = 6; // RGBA
  ihdr[10] = 0; // compression
  ihdr[11] = 0; // filter
  ihdr[12] = 0; // interlace

  const ihdrChunk = makeChunk('IHDR', ihdr);
  const idatChunk = makeChunk('IDAT', deflated);
  const iendChunk = makeChunk('IEND', Buffer.alloc(0));

  const png = Buffer.concat([header, ihdrChunk, idatChunk, iendChunk]);
  fs.writeFileSync(outPath, png);
  console.log(`Generated ${outPath} (${width}x${height}, ${png.length} bytes)`);
}

generateAppIcon(192, 'c:/antigravity/public/brand/icon-192.png');
generateAppIcon(512, 'c:/antigravity/public/brand/icon-512.png');
generateAppIcon(180, 'c:/antigravity/public/brand/apple-touch-icon.png');
