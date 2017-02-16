"use babel";

import fs from "fs";
import path from "path";

export default assetRoot => new Promise((res, rej) => {

  if (!fs.existsSync(assetRoot)) {
    return {
      dirs: [],
      imgs: []
    };
  }

  fs.readdir(assetRoot, (err, files) => {
    let dirs = [];
    let imgs = [];

    if (err) {
      return rej(err);
    }

    files.forEach(f => {
      const fullPath = assetRoot + f;
      let file;
      try {
        file = fs.statSync(fullPath);
      } catch (e) {
        return;
      }

      if (file.isDirectory()) {
        dirs.push({
          type: "directory",
          size: file.size,
          fullPath,
          name: f
        });

        return;
      }

      const ext = path.extname(f);
      if ([".png", ".jpg", ".gif"].indexOf(ext) !== -1) {
        imgs.push({
          type: "image",
          size: file.size,
          fullPath,
          name: f
        });
      }
      return null;
    });

    res({
      dirs,
      imgs
    });
  });
});
