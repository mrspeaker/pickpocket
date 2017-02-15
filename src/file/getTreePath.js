"use babel";
/* global atom */

const getTreePath = () => {
  // Grab current path from tree-view
  const tree = atom.packages.getActivePackage("tree-view");
  if ( !tree ) { return ""; }
  const { treeView } = tree.mainModule;
  if (!treeView) { return ""; }
  const { selectedPath } = treeView;
  if ( !selectedPath ) { return ""; }

  const isFile = !!( treeView.entryForPath( selectedPath ).file );
  const folderPath = !isFile ? selectedPath : selectedPath.split( "/").slice( 0, -1 ).join( "/" );
  const [ , relativePath ] = atom.project.relativizePath( folderPath );
  const trailing = relativePath ? "/" : "";
  return `/${ relativePath }${ trailing }`;
};

export default getTreePath;
