"use babel";
/* global atom */

import isGitPathIgnored from "./isGitPathIgnored";

function getEntries(folder) {
  return new Promise((res, rej) => {
    folder.getEntries((err, entries) => {
      if (err) {
        return rej(err);
      }
      res(entries);
    });
  });
}

async function fetchAllImages(
  directories = atom.project.getDirectories(),
  useGitIgnore = true,
  maxDepth = 20
) {
  async function getImagesInDir(entries, depth) {
    return await entries.reduce(async (allFiles, f) => {
      const ac = await allFiles;

      // Don't process git-ignored paths
      if (useGitIgnore && isGitPathIgnored(f.getPath())) {
        return ac;
      }

      if (depth <= 0) {
        console.warn("too many folders");
        return ac;
      }

      if (f.isDirectory()) {
        const nextEntries = await getEntries(f);
        const nestedAc = await getImagesInDir(nextEntries, depth--);
        return [...ac, ...nestedAc];
      } else {
        if ([".png", ".jpg", ".gif"].some(e => f.getBaseName().endsWith(e))) {
          ac.push({
            type: "image",
            size: 10,
            fullPath: f.getPath(),
            name: f.getBaseName()
          });
        }
      }
      return ac;
    }, Promise.resolve([]));
  }

  // TODO: check if in a project with a root dir.
  const rootEntries = await getEntries(directories[0]);
  const projectImages = await getImagesInDir(rootEntries, maxDepth);
  return {
    dirs: [],
    imgs: projectImages
  };
}

export default fetchAllImages;
