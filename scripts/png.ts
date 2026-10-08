// A small PNG writer and reader for the paper textures (scripts/paper-tiles.ts).
// Writes 8-bit RGB, as an indexed image when it has 256 colours or fewer (the
// lit paper has a few dozen), with a tEXt chunk recording what it was made
// from; reads that chunk back.

import { deflateSync } from "node:zlib";

const crcTable = Array.from({ length: 256 }, (_, n) => {
  let c = n;
  for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
  return c >>> 0;
});

function crc32(buf: Uint8Array) {
  let c = 0xffffffff;
  for (const b of buf) c = crcTable[(c ^ b) & 0xff] ^ (c >>> 8);
  return (c ^ 0xffffffff) >>> 0;
}

function chunk(type: string, data: Uint8Array) {
  const out = Buffer.alloc(12 + data.length);
  out.writeUInt32BE(data.length, 0);
  out.write(type, 4, "latin1");
  out.set(data, 8);
  out.writeUInt32BE(crc32(out.subarray(4, 8 + data.length)), 8 + data.length);
  return out;
}

const paeth = (a: number, b: number, c: number) => {
  const pa = Math.abs(b - c);
  const pb = Math.abs(a - c);
  const pc = Math.abs(a + b - 2 * c);
  return pa <= pb && pa <= pc ? a : pb <= pc ? b : c;
};

/** Scanlines of `bpp`-byte pixels, each run through the one filter that compresses smallest overall. */
function compress(rows: Uint8Array[], bpp: number) {
  let best: Buffer | undefined;
  for (const filter of [0, 1, 2, 4]) {
    const raw = Buffer.alloc(rows.length * (rows[0].length + 1));
    rows.forEach((row, y) => {
      const prev = y ? rows[y - 1] : undefined;
      const at = y * (row.length + 1);
      raw[at] = filter;
      for (let x = 0; x < row.length; x++) {
        const a = x >= bpp ? row[x - bpp] : 0;
        const b = prev ? prev[x] : 0;
        const c = prev && x >= bpp ? prev[x - bpp] : 0;
        const p = filter === 1 ? a : filter === 2 ? b : filter === 4 ? paeth(a, b, c) : 0;
        raw[at + 1 + x] = (row[x] - p) & 0xff;
      }
    });
    const data = deflateSync(raw, { level: 9, memLevel: 9 });
    if (!best || data.length < best.length) best = data;
  }
  return best!;
}

/** Encodes RGBA pixels (alpha ignored: the textures are opaque) as a PNG. */
export function encodePng(width: number, height: number, rgba: Uint8Array, text: Record<string, string> = {}) {
  const colours = new Map<number, number>();
  for (let i = 0; i < width * height && colours.size <= 256; i++) {
    const key = (rgba[i * 4] << 16) | (rgba[i * 4 + 1] << 8) | rgba[i * 4 + 2];
    if (!colours.has(key)) colours.set(key, 0);
  }
  const indexed = colours.size <= 256;
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8;
  ihdr[9] = indexed ? 3 : 2;
  const chunks = [chunk("IHDR", ihdr)];
  const rows: Uint8Array[] = [];
  if (indexed) {
    // Palette in order of brightness, so neighbouring pixels have neighbouring indices.
    const keys = [...colours.keys()].sort((a, b) => (a >> 16) + ((a >> 8) & 0xff) + (a & 0xff) - ((b >> 16) + ((b >> 8) & 0xff) + (b & 0xff)));
    keys.forEach((key, i) => colours.set(key, i));
    chunks.push(chunk("PLTE", Uint8Array.from(keys.flatMap((k) => [k >> 16, (k >> 8) & 0xff, k & 0xff]))));
    for (let y = 0; y < height; y++) {
      const row = new Uint8Array(width);
      for (let x = 0; x < width; x++) {
        const i = (y * width + x) * 4;
        row[x] = colours.get((rgba[i] << 16) | (rgba[i + 1] << 8) | rgba[i + 2])!;
      }
      rows.push(row);
    }
  } else {
    for (let y = 0; y < height; y++) {
      const row = new Uint8Array(width * 3);
      for (let x = 0; x < width; x++) row.set(rgba.subarray((y * width + x) * 4, (y * width + x) * 4 + 3), x * 3);
      rows.push(row);
    }
  }
  for (const [key, value] of Object.entries(text)) chunks.push(chunk("tEXt", Buffer.from(`${key}\0${value}`, "latin1")));
  chunks.push(chunk("IDAT", compress(rows, indexed ? 1 : 3)), chunk("IEND", new Uint8Array()));
  return Buffer.concat([Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]), ...chunks]);
}

/** The tEXt entries of a PNG. */
export function readPngText(png: Uint8Array) {
  const buf = Buffer.from(png);
  const text: Record<string, string> = {};
  for (let at = 8; at + 8 <= buf.length; ) {
    const length = buf.readUInt32BE(at);
    const type = buf.toString("latin1", at + 4, at + 8);
    if (type === "tEXt") {
      const body = buf.toString("latin1", at + 8, at + 8 + length);
      const split = body.indexOf("\0");
      text[body.slice(0, split)] = body.slice(split + 1);
    }
    if (type === "IEND") break;
    at += 12 + length;
  }
  return text;
}
