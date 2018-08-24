"use babel";

import fs from "fs";
import path from "path";

//TODO: Can be rewritten using Atom functions
// instead of fs? atom.projct.getDirectories()... etc
export default folder =>
  new Promise((res, rej) => {
    if (!fs.existsSync(folder)) {
      return {
        dirs: [],
        imgs: []
      };
    }
    fs.readdir(folder, (err, files) => {
      let dirs = [];
      let imgs = [];

      if (err) {
        return rej(err);
      }

      files.forEach(f => {
        const fullPath = folder + f;
        let file;
        try {
          file = fs.statSync(fullPath);
        } catch (e) {
          console.log("Couldn't stat", e);
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
