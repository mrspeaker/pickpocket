"use babel";
/* global atom */

import React from "react";
import proc from "child_process";
const { exec } = proc;

import PickPocket from "./PickPocket";
import EffectPocket from "./EffectPocket";

import fetchImagesFromFolder from "./file/fetchImagesFromFolder";
import copyFile from "./file/copyFile";
import writeImage from "./file/writeImage";
import getTreePath from "./file/getTreePath";
import getProjectRoot from "./file/getProjectRoot";
import utils from "./utils";

const {
  Component,
  PropTypes
} = React;

class App extends Component {
  static propTypes = {
    toggle: PropTypes.func.isRequired
  };

  state = {
    dirs: [],
    imgs: [],
    mode: "pick",
    selectedAsset: null,
    path: "",
    fileName: ""
  };

  componentDidMount() {
    fetchImagesFromFolder(this.getAssetRoot())
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

  getAssetRoot() {
    let root = atom.config.get("pickpocket.assetFolder");
    if (!root.endsWith("/")) {
      root += "/";
    }
    return root;
  }

  onImport = (asset, path, fileName, doOpen = false) => {
    const projectRoot = getProjectRoot();
    if (!projectRoot) {
      return this.props.toggle();
    }

    copyFile(asset.fullPath, projectRoot, path, fileName)
      .then(res => this.onImportSuccess({ ...res, doOpen }))
      .catch(err => err && atom.notifications.addError(err));

    this.onClose();
  };

  onImportCanvas = canvas => {
    const projectRoot = getProjectRoot();
    if (!projectRoot) {
      return this.props.toggle();
    }

    const { path, fileName } = this.state;
    const imgData = canvas.toDataURL("image/png");

    writeImage(imgData, projectRoot, path, fileName)
      .then(this.onImportSuccess)
      .catch(err => err && atom.notifications.addError(err));

    this.onClose();
  };

  onImportSuccess(
    { localPathAndName, localFullPath, fileName, path, doOpen = false }
  ) {
    atom.clipboard.write(`"${localPathAndName}"`);
    atom.notifications.addSuccess(`Copied ${fileName} to ${path}`);
    doOpen && this.openEditor(localFullPath);
  }

  switchMode = (selectedAsset, path, fileName) => {
    if (selectedAsset) {
      this.setState({
        mode: "fx",
        selectedAsset,
        path,
        fileName
      });
    } else {
      this.setState({
        mode: "pick"
      }, () => {
        // Forces mini-editor update
        this.forceUpdate();
      });
    }
  };

  changePath = newPath => fetchImagesFromFolder(newPath).then(res => {
    if (newPath !== this.getAssetRoot()) {
      res.dirs.splice(0, 0, {
        type: "directory",
        size: 0,
        fullPath: utils.parentPath(newPath),
        name: ".."
      });
    }
    this.setState({
      dirs: res.dirs,
      imgs: res.imgs
    });
  });

  openEditor(fullPath) {
    const ed = atom.config.get("pickpocket.imageEditorAppName");
    if (ed) {
      exec(`open -a ${ed} ${fullPath}`);
    }
  }

  onOpenAssets = () => {
    exec(`open ${this.getAssetRoot()}`);
  };

  onClose = () => {
    this.setState({ mode: "pick" });
    this.props.toggle();
  };

  render() {
    const { dirs, imgs, mode, selectedAsset } = this.state;
    return mode === "pick"
      ? <PickPocket
          treePath={getTreePath()}
          assets={{ dirs, imgs }}
          onChangePath={this.changePath}
          onClose={this.onClose}
          onImport={this.onImport}
          onOpenAssets={this.onOpenAssets}
          onSwitchMode={this.switchMode}
        />
      : <EffectPocket
          onClose={this.onClose}
          onImport={this.onImportCanvas}
          onSwitchMode={this.switchMode}
          asset={selectedAsset}
        />;
  }
}

export default App;
