/**
 * Patch the Shiki Typst TextMate grammar so fenced raw blocks (```) close properly.
 *
 * The upstream grammar sets the end pattern for raw blocks to \x00 (null byte),
 * which never matches — so everything after the opening ``` is swallowed.
 * We replace it with a proper closing pattern of three or more backticks.
 *
 * Run automatically via the "postinstall" script.
 */

const grammarPath = new URL("../node_modules/@shikijs/langs/dist/typst.mjs", import.meta.url)
  .pathname;

const file = Bun.file(grammarPath);
let src = await file.text();

const before = '\\"end\\":\\"\\\\\\\\x00\\",\\"name\\":\\"markup.raw.block.typst\\"';
const after = '\\"end\\":\\"`{3,}\\",\\"name\\":\\"markup.raw.block.typst\\"';

if (!src.includes(before)) {
  if (src.includes(after)) {
    console.log("Typst grammar already patched.");
    process.exit(0);
  }
  console.error("Could not find raw-block pattern to patch in Typst grammar.");
  process.exit(1);
}

src = src.replace(before, after);
await Bun.write(grammarPath, src);
console.log("Patched Typst grammar: raw block end pattern fixed.");
