"use babel";
/* global atom */

const getTreeFile = () => {
  // Grab current path from tree-view
  const out = { path: "", file: null }
  const tree = atom.packages.getActivePackage("tree-view");
  if (!tree) {
    return out;
  }
  const { treeView } = tree.mainModule;
  if (!treeView) {
    return out;
  }
  const { selectedPath } = treeView;
  if (!selectedPath) {
    return out;
  }

  const isFile = !!treeView.entryForPath(selectedPath).file;
  if (isFile) {
    out.file = treeView.entryForPath(selectedPath).file;
  }
  const folderPath = !isFile
    ? selectedPath
    : selectedPath.split("/").slice(0, -1).join("/");
  const [, relativePath] = atom.project.relativizePath(folderPath);
  const trailing = relativePath ? "/" : "";
  out.path = `/${relativePath}${trailing}`;
  return out;
};

export default getTreeFile;
