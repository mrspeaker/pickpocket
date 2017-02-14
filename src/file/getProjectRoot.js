/* global atom */

const getProjectRoot = () => {
  const dirs = atom.project.getDirectories();
  if (!dirs.length) {
    atom.notifications.addError("Not in a project - can't copy here.");
    return;
  }
  return dirs[0].path;
};

export default getProjectRoot;
