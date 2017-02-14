"use babel";

import fs from "fs";

const checkFile = (toRoot, toPath, toName) => {
  const localFullDir = `${ toRoot }${ toPath }`;
  const localPathAndName = `${ toPath }${ toName }`;
  const localFullPath = `${ toRoot }${ localPathAndName }`;

  return new Promise((res, rej) => {
    fs.stat(localFullDir, err => {
      if (err) {
        return rej(`Path ${ toPath } does not exist.`);
      }

      // Check if local file already exists
      fs.stat(localFullPath, (err, stats) => {
        if (stats && stats.isFile()) {
          if (!confirm(`overwrite ${localPathAndName}?`)) {
            return rej("");
          }
        }

        // All good...
        return res({localPathAndName, localFullPath, path: toPath, fileName: toName});
      });
    });
  });
};

export default checkFile;
