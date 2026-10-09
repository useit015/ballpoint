// Bakes SVG textures that run feTurbulence filters into plain PNGs (the page
// uses the PNGs, the SVGs stay here as their sources). As CSS masks and
// backgrounds the filtered SVGs are re-run for every tile the page paints,
// while a PNG is a bitmap the browser decodes once.
//
// - public/stain-*.src.svg -> public/stain-*.png: grey+alpha masks (the stains)
// - public/paper/tooth-*.svg (written by scripts/paper-tiles.ts) ->
//   tooth-*.png: the paper's fine tooth, a 128px tile under every sheet
//
// Run `node scripts/bake-textures.ts` after editing a source, and commit the PNGs.

import { readFileSync, writeFileSync } from "node:fs";
import { deflateSync, crc32 } from "node:zlib";

const textures = [
  { src: "public/stain-ring.src.svg", out: "public/stain-ring.png", mask: true },
  { src: "public/stain-foxing.src.svg", out: "public/stain-foxing.png", mask: true },
  { src: "public/paper/tooth-light.svg", out: "public/paper/tooth-light.png", mask: false },
  { src: "public/paper/tooth-dark.svg", out: "public/paper/tooth-dark.png", mask: false },
];

/** Encodes RGBA pixels as 8-bit RGBA, or as grey+alpha for a mask (which only needs alpha). */
function encode(width: number, height: number, rgba: Uint8Array, mask: boolean) {
  const bpp = mask ? 2 : 4;
  const stride = width * bpp + 1;
  const raw = Buffer.alloc(stride * height);
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const i = (y * width + x) * 4;
      const o = y * stride + 1 + x * bpp;
      if (mask) raw[o + 1] = rgba[i + 3];
      else for (let c = 0; c < 4; c++) raw[o + c] = rgba[i + c];
    }
  }
  const chunk = (type: string, data: Buffer) => {
    const body = Buffer.concat([Buffer.from(type), data]);
    const out = Buffer.alloc(body.length + 8);
    out.writeUInt32BE(data.length, 0);
    body.copy(out, 4);
    out.writeUInt32BE(crc32(body), body.length + 4);
    return out;
  };
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8;
  ihdr[9] = mask ? 4 : 6;
  return Buffer.concat([Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]), chunk("IHDR", ihdr), chunk("IDAT", deflateSync(raw, { level: 9 })), chunk("IEND", Buffer.alloc(0))]);
}

const { chromium } = await import("@playwright/test");
const browser = await chromium.launch(process.env.CHROME_PATH ? { executablePath: process.env.CHROME_PATH } : {});
try {
  const page = await browser.newPage();
  for (const { src, out, mask } of textures) {
    const svg = readFileSync(new URL(`../${src}`, import.meta.url), "utf8");
    const { w, h, b64 } = await page.evaluate(async (svg) => {
      const img = new Image();
      img.src = `data:image/svg+xml,${encodeURIComponent(svg)}`;
      await img.decode();
      const w = img.naturalWidth;
      const h = img.naturalHeight;
      const ctx = new OffscreenCanvas(w, h).getContext("2d")!;
      ctx.drawImage(img, 0, 0, w, h);
      const px = ctx.getImageData(0, 0, w, h).data;
      let s = "";
      for (let i = 0; i < px.length; i += 0x8000) s += String.fromCharCode(...px.subarray(i, i + 0x8000));
      return { w, h, b64: btoa(s) };
    }, svg);
    writeFileSync(new URL(`../${out}`, import.meta.url), encode(w, h, Buffer.from(b64, "base64"), mask));
    console.log(`${out} ${w}x${h}`);
  }
} finally {
  await browser.close();
}
