"use babel";

import fs from "fs";
import checkFile from "./checkFile";

const copyFile = (fromFullPath, toRoot, toPath, toFileName) =>
  checkFile(toRoot, toPath, toFileName).then(
    deets =>
      new Promise((res, rej) => {
        const { localFullPath } = deets;
        // TODO: use fs-extras copy, and error check
        try {
          fs.writeFileSync(localFullPath, fs.readFileSync(fromFullPath));
        } catch (e) {
          return rej("Error writing file.");
        }
        return res(deets);
      })
  );

export default copyFile;
