"use babel";
/* global atom */

const repos = atom.project.getRepositories();

// TODO: figure out how atom treats submodules
const repo = repos.length ? repos[0] : null;

export default path => !repo ? false : repo.isPathIgnored(path);
