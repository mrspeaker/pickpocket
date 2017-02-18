"use babel";
/* global atom */

const getAssetRoot = () => {
  let root = atom.config.get("pickpocket.assetFolder");
  if (!root.endsWith("/")) {
    root += "/";
  }
  return root;
};

export default getAssetRoot;
