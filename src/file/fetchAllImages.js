"use babel";
/* global atom */

import readGitIgnore from "./readGitIgnore";

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
  let gitignores = null;
  if (useGitIgnore) {
    // Read gitignore file
    gitignores = await readGitIgnore();
  }

  console.log("should ignore:", gitignores);
  // From folder, recurse all dirs
  //  if dir in gitignore, skip
  //    For files in dir
  //      if img, add.
  async function getImagesInDir(entries, depth) {
    return await entries.reduce(async (allFiles, f) => {
      const ac = await allFiles;
      if (f.isDirectory()) {
        if (
          depth <= 0 ||
          f.getBaseName().includes("node_modules") ||
          f.getBaseName().includes("git")
        ) {
          return ac;
        }

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
