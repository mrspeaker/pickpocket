"use babel";

import fs from "fs";
import checkFile from "./checkFile";

const writeImage = (imgData, toRoot, toPath, toName) => checkFile(
  toRoot,
  toPath,
  toName
).then(
  deets => new Promise((res, rej) => {
    const { localFullPath } = deets;
    const data = imgData.replace(/^data:image\/\w+;base64,/, "");
    const buf = new Buffer(data, "base64");
    try {
      fs.writeFile(localFullPath, buf);
    } catch (e) {
      return rej("couldn't write image");
    }
    return res(deets);
  })
);

export default writeImage;
