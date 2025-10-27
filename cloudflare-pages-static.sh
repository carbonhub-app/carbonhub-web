#!/usr/bin/env bash
set -euo pipefail

CONFIG_FILE="${1:-next.config.ts}"

if [ ! -f "$CONFIG_FILE" ]; then
  echo "next.config.ts not found at: $CONFIG_FILE" >&2
  exit 1
fi

TARGET_FILE="$CONFIG_FILE" node <<'NODE'
const fs = require('fs');
const path = require('path');

const filePath = process.env.TARGET_FILE;
if (!filePath) {
  console.error('TARGET_FILE environment variable is not set.');
  process.exit(1);
}

const absPath = path.resolve(filePath);
let source = fs.readFileSync(absPath, 'utf8');
const original = source;

const outputPropertyRegex = /output\s*:\s*['"`][^'"`]+['"`]\s*,?/;
if (outputPropertyRegex.test(source)) {
  source = source.replace(outputPropertyRegex, "output: 'export',");
} else {
  const nextConfigRegex = /(const\s+nextConfig[^=]*=\s*{\s*\n)/;
  if (nextConfigRegex.test(source)) {
    source = source.replace(nextConfigRegex, "$1  output: 'export',\n");
  } else {
    console.error('Unable to locate nextConfig object to insert output property.');
    process.exit(1);
  }
}

if (!/images\s*:\s*{[^}]*unoptimized\s*:/.test(source)) {
  const imagesBlockRegex = /(images\s*:\s*{\s*\n)/;
  if (imagesBlockRegex.test(source)) {
    source = source.replace(imagesBlockRegex, "$1    unoptimized: true,\n");
  } else {
    console.error('Unable to locate images block to insert unoptimized property.');
    process.exit(1);
  }
}

if (source !== original) {
  fs.writeFileSync(absPath, source);
  console.log(`Updated ${path.relative(process.cwd(), absPath)}`);
} else {
  console.log(`No changes needed for ${path.relative(process.cwd(), absPath)}`);
}
NODE
