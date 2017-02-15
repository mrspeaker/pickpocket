"use babel";

import fs from "fs";
import checkFile from "./checkFile";

const copyFile = (from, rootPath, path, fileName) => checkFile(
  rootPath,
  path,
  fileName
).then(
  deets => new Promise((res, rej) => {
    const { localFullPath } = deets;
    // TODO: use fs-extras copy, and error check
    try {
      fs.writeFileSync(localFullPath, fs.readFileSync(from));
    } catch (e) {
      return rej("Error writing file.");
    }
    return res(deets);
  })
);

export default copyFile;
