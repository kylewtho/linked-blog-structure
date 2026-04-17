import fs from "node:fs";
import path from "node:path";

export const getFilesRecursively = (directory, fileExtRegex) => {
  const files = [];
  const recusiveFindFiles = (dir) => {
    const filesInDirectory = fs.readdirSync(dir);
    for (const file of filesInDirectory) {
      const absolute = path.join(dir, file);
      if (fs.statSync(absolute).isDirectory()) {
        recusiveFindFiles(absolute);
      } else if (path.extname(absolute).match(fileExtRegex)) {
        files.push(path.relative(directory, absolute));
      }
    }
  };
  recusiveFindFiles(directory);
  return files;
};
