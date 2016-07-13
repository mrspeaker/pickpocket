"use babel";

const utils = {
  splitPathAndFileName: (text) => {
    const path = text.split("/").slice(0, -1).join("/") + "/";
    const fileName = text.split("/").slice(-1)[0];
    return {
      path,
      fileName
    };
  }
};

export default utils;
