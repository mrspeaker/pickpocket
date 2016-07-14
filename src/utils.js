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
  parentPath: path => path.split("/").slice(0, -2).join("/")
};

export default utils;
