import sharp from 'sharp';
import { readFileSync, writeFileSync } from 'fs';
import { fileURLToPath } from 'url';
import path from 'path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const svgPath = path.join(__dirname, '../public/favicon.svg');
const icoPath = path.join(__dirname, '../public/favicon.ico');

const sizes = [16, 32, 48];

async function buildIco() {
  const svgBuffer = readFileSync(svgPath);

  const pngs = await Promise.all(
    sizes.map(size =>
      sharp(svgBuffer, { density: 192 })
        .resize(size, size)
        .png()
        .toBuffer()
    )
  );

  // ICO header — 6 bytes
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0);           // reserved
  header.writeUInt16LE(1, 2);           // type: 1 = icon
  header.writeUInt16LE(sizes.length, 4); // image count

  // ICONDIRENTRY — 16 bytes per image
  const dirEntries = [];
  let dataOffset = 6 + 16 * sizes.length;

  for (let i = 0; i < sizes.length; i++) {
    const entry = Buffer.alloc(16);
    const sz = sizes[i];
    entry.writeUInt8(sz === 256 ? 0 : sz, 0);  // width  (0 means 256)
    entry.writeUInt8(sz === 256 ? 0 : sz, 1);  // height
    entry.writeUInt8(0, 2);                      // color count (0 = truecolor)
    entry.writeUInt8(0, 3);                      // reserved
    entry.writeUInt16LE(1, 4);                   // color planes
    entry.writeUInt16LE(32, 6);                  // bits per pixel
    entry.writeUInt32LE(pngs[i].length, 8);      // image data size
    entry.writeUInt32LE(dataOffset, 12);          // image data offset
    dataOffset += pngs[i].length;
    dirEntries.push(entry);
  }

  const icoBuffer = Buffer.concat([header, ...dirEntries, ...pngs]);
  writeFileSync(icoPath, icoBuffer);
  console.log(`favicon.ico written — ${icoBuffer.length} bytes (sizes: ${sizes.join(', ')}px)`);
}

buildIco().catch(err => { console.error(err); process.exit(1); });
