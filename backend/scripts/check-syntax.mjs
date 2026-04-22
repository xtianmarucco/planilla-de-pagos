import { readdir } from "node:fs/promises";
import { join } from "node:path";
import { spawnSync } from "node:child_process";

const roots = ["src", "test", "eslint.config.js"];

const collectFiles = async (path) => {
  const entries = await readdir(path, { withFileTypes: true }).catch(() => []);
  const files = [];

  for (const entry of entries) {
    const fullPath = join(path, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await collectFiles(fullPath)));
    } else if (entry.isFile() && fullPath.endsWith(".js")) {
      files.push(fullPath);
    }
  }

  return files;
};

const files = [];
for (const root of roots) {
  if (root.endsWith(".js")) {
    files.push(root);
  } else {
    files.push(...(await collectFiles(root)));
  }
}

let failed = false;
for (const file of files) {
  const result = spawnSync(process.execPath, ["--check", file], {
    stdio: "inherit",
  });
  if (result.status !== 0) failed = true;
}

if (failed) process.exit(1);
