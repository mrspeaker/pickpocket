"use babel";

const utils = {
  splitPathAndFileName: (text) => {
    const path = text.split("/").slice(0, -1).join("/") + "/";
    const fileName = text.split("/").slice(-1)[0];
    return {
      path,
      fileName
    };
  },
  parentPath: path => path.split("/").slice(0, -2).join("/"),
  toKb: size => (size / 1000).toFixed(size < 1000 ? 1 : 0) + "K"
};

export default utils;
