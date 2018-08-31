"use babel";
/* global atom */

// TODO: look for .gitignore, return names
const repos = atom.project.getRepositories();
const repo = repos.length ? repos[0] : null;

export default path => !repo ? true : repo.isPathIgnored(path);
