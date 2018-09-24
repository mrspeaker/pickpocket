"use babel";
/* global atom */

import React from "react";
import proc from "child_process";
const { exec } = proc;

import PickScreen from "./screens/PickScreen";
import CreateScreen from "./screens/CreateScreen";

import fetchImagesFromFolder from "./file/fetchImagesFromFolder";
import fetchAllImages from "./file/fetchAllImages";
import copyFile from "./file/copyFile";
import writeImage from "./file/writeImage";
import getTreeFile from "./file/getTreeFile";
import getProjectRoot from "./file/getProjectRoot";
import getAssetRoot from "./file/getAssetRoot";
import utils from "./utils";

import Footer from "./ui/Footer";

const { Component, PropTypes } = React;

class App extends Component {
  static propTypes = {
    toggle: PropTypes.func.isRequired
  };

  state = {
    dirs: [],
    imgs: [],
    projDirs: [],
    projImgs: [],

    pickFromAssets: true,
    mode: "pick"
  };

  componentDidMount() {
    this.fetchProjectImages();

    fetchImagesFromFolder(getAssetRoot())
      .then(({ dirs, imgs }) => {
        this.setState({
          dirs,
          imgs
        });
      })
      .catch(() => {
        atom.notifications.addError(
          "Please set asset folder set in preferences"
        );
        atom.notifications.addError(this.getAssetRoot());
        this.props.toggle();
      });
  }

  onPath = path => {
    switch (process.platform) {
      case "darwin":
        exec(`open ${path}`);
        break;
      case "linux":
        exec(`xdg-open ${path}`);
        break;
      default:
        console.warn("Open not implemented for ", process.platform);
    }
  };

  onImport = (asset, saveName, doOpen, canvas) => {
    const { pickFromAssets } = this.state;
    const isLocal = !pickFromAssets;

    // Can't save if no project root
    const projectRoot = getProjectRoot();
    if (!projectRoot) {
      return Promise.reject("No root folder");
    }

    const src = canvas || asset.fullPath;
    let root, path;
    if (isLocal) {
      root = asset.fullPath.includes(projectRoot) ? projectRoot : "";
      path = asset.fullPath.slice(root.length).slice(0, -asset.name.length);
    } else {
      root = projectRoot;
      path = getTreeFile().path;
    }

    // Only open the file (local file, no edits)
    if (isLocal && doOpen && !canvas) {
      return Promise.resolve(this.openEditor(root + path + saveName));
    }

    // Write or copy the file
    const importFunc = src === canvas ? writeImage : copyFile;

    if (canvas && !saveName.toLowerCase().endsWith(".png")) {
      if (
        !confirm(
          "NOTE! Currently effected images will only be saved in PNG format. Still want to save?"
        )
      ) {
        return Promise.resolve();
      }
    }

    return importFunc(src, root, path, saveName)
      .then(res => this.onImportSuccess({ ...res, doOpen }))
      .then(() => doOpen && this.openEditor(root + path + saveName))
      .catch(err => err && atom.notifications.addError(err));
  };

  onImportSuccess({
    localPathAndName,
    localFullPath,
    fileName,
    path,
    doOpen = false
  }) {
    atom.clipboard.write(`"${localPathAndName}"`);
    atom.notifications.addSuccess(`Copied ${fileName} to ${path}`);
    doOpen && this.openEditor(localFullPath);
    this.fetchProjectImages();
  }

  onChangeAssetPath = newPath =>
    fetchImagesFromFolder(newPath).then(res => {
      const { pickFromAssets } = this.state;
      if (newPath !== getAssetRoot()) {
        res.dirs.splice(0, 0, {
          type: "directory",
          size: 0,
          fullPath: utils.parentPath(newPath),
          name: ".."
        });
      }
      this.setState({
        [pickFromAssets ? "dirs" : "projDirs"]: res.dirs,
        [pickFromAssets ? "imgs" : "projImgs"]: res.imgs
      });
    });

  fetchProjectImages() {
    fetchAllImages().then(({ imgs }) => {
      this.setState({ projImgs: imgs });
    });
  }

  openEditor(fullPath) {
    const ed = atom.config.get("pickpocket.imageEditorAppName");
    if (ed) {
      switch (process.platform) {
        case "darwin":
          exec(`open -a ${ed} ${fullPath}`);
          break;
        default:
          exec(`${ed} ${fullPath}`);
          break;
      }
    }
  }

  onOpenSettings = () => {
    atom.workspace.open("atom://config/packages/pickpocket");
  };

  onClose = () => {
    this.setState({ mode: "pick" }, () => {
      this.props.toggle();
    });
  };

  onToggleSource = () => {
    this.setState(({ pickFromAssets }) => ({
      pickFromAssets: !pickFromAssets
    }));
  };

  render() {
    const { dirs, imgs, projDirs, projImgs, mode, pickFromAssets } = this.state;

    const curDirs = pickFromAssets ? dirs : projDirs;
    const curImgs = pickFromAssets ? imgs : projImgs;

    const isProject = mode === "pick" && !pickFromAssets;
    const isAssets = mode === "pick" && !isProject;
    const isGenerate = mode === "create";

    let screen;
    switch (mode) {
      case "pick":
        screen = (
          <PickScreen
            assets={{ dirs: curDirs, imgs: curImgs }}
            pickFromAssets={pickFromAssets}
            onChangePath={this.onChangeAssetPath}
            onImport={this.onImport}
            onToggleSource={this.onToggleSource}
          />
        );
        break;
      case "create":
        screen = <CreateScreen onImport={this.onImport} />;
        break;
    }

    return (
      <div className="pickpocket">
        <div className="btn-toolbar toolbar">
          <div class="btn-group">
            <button
              title="generate new asset"
              className={`btn icon icon-file-media ${
                isProject ? "selected" : ""
              }`}
              onClick={() => {
                this.setState({
                  pickFromAssets: false,
                  mode: "pick"
                });
              }}
            >
              project
            </button>
            <button
              title="generate new asset"
              className={`btn icon icon-package ${isAssets ? "selected" : ""}`}
              onClick={() => {
                this.setState({
                  pickFromAssets: true,
                  mode: "pick"
                });
              }}
            >
              pocket
            </button>
            <button
              title="generate new asset"
              className={`btn icon icon-pulse ${isGenerate ? "selected" : ""}`}
              onClick={() => {
                this.setState({
                  mode: "create"
                });
              }}
            >
              generate
            </button>
            <button
              style={{ float: "right" }}
              className="btn icon icon-gear"
              onClick={this.onOpenSettings}
              title="go to pickpocket settings"
            />
          </div>
        </div>
        {screen}
        <Footer />
      </div>
    );
  }
}

export default App;
