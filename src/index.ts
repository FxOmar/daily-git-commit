import fs from "fs";
import path from "path";

// List all files in a directory: find . -type f -print0 | xargs -0 ls -l | wc -l
function getFiles(dir: string): string[] {
  return fs
    .readdirSync(dir)
    .filter((file) => fs.statSync(path.join(dir, file)).isFile());
}

const files = getFiles("/Users/fx_omar/Developer");

console.log(files);
