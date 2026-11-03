import fs from 'node:fs';
import path from 'node:path';
import { gzipSync } from 'node:zlib';
const walk = (directory) =>
  fs
    .readdirSync(directory, { withFileTypes: true })
    .flatMap((entry) =>
      entry.isDirectory()
        ? walk(path.join(directory, entry.name))
        : [path.join(directory, entry.name)],
    );
const files = walk('.output/public');
const report = {};
for (const [label, extension] of [
  ['javascript', '.js'],
  ['css', '.css'],
  ['fonts', '.woff2'],
  ['images', '.webp'],
]) {
  const selected = files.filter((file) => file.endsWith(extension));
  report[label] = {
    files: selected.length,
    bytes: selected.reduce((sum, file) => sum + fs.statSync(file).size, 0),
  };
  if (['javascript', 'css'].includes(label))
    report[label].gzipBytes = selected.reduce(
      (sum, file) => sum + gzipSync(fs.readFileSync(file)).length,
      0,
    );
}
report.totalStaticBytes = files.reduce(
  (sum, file) => sum + fs.statSync(file).size,
  0,
);
report.note =
  'Built artifact measurements. Gzip is an offline estimate, not a Lighthouse score or measured live transfer.';
fs.writeFileSync(
  'docs/payload-report.json',
  JSON.stringify(report, null, 2) + '\n',
);
console.log(report);
