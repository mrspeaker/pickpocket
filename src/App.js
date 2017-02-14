"use babel";
/* global atom */

import React from "react";
import PickPocket from "./PickPocket";
import EffectPocket from "./EffectPocket";

import proc from "child_process";
const { exec } = proc;
import fetchImagesFromFolder from "./file/fetchImagesFromFolder";
import copyFile from "./file/copyFile";
import writeImage from "./file/writeImage";
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
    fileName: "",
  };

  componentDidMount () {
    fetchImagesFromFolder(this.getAssetRoot())
      .then(({dirs, imgs}) => {
        this.setState({
          dirs,
          imgs
        });
      })
      .catch(() => {
        atom.notifications.addError("Please set asset folder set in preferences");
        atom.notifications.addError(this.getAssetRoot());
        this.props.toggle();
      });
  }

  getAssetRoot () {
    let root = atom.config.get("pickpocket.assetFolder");
    if (!root.endsWith("/")) {
      root += "/";
    }
    return root;
  }

  getProjectRoot = () => {
    const dirs = atom.project.getDirectories();
    if (!dirs.length) {
      atom.notifications.addError("Not in a project - can't copy here.");
      this.props.toggle();
      return;
    }
    return dirs[0].path;
  }

  onImport = (asset, path, fileName, doOpen = false) => {
    const projectRoot = this.getProjectRoot();
    if (!projectRoot) return;

    copyFile(asset.fullPath, projectRoot, path, fileName)
      .then(res => this.onImportSuccess({...res, doOpen}))
      .catch(err => err && atom.notifications.addError(err));

    this.onClose();
  };

  onImportCanvas = canvas => {
    const projectRoot = this.getProjectRoot();
    if (!projectRoot) return;

    const {path, fileName} = this.state;
    const imgData = canvas.toDataURL("image/png");

    writeImage(imgData, projectRoot, path, fileName)
      .then(this.onImportSuccess)
      .catch(err => err && atom.notifications.addError(err));

    this.onClose();
  }

  onImportSuccess ({localPathAndName, localFullPath, fileName, path, doOpen = false}) {
    atom.clipboard.write( `"${ localPathAndName }"` );
    atom.notifications.addSuccess(`Copied ${ fileName } to ${ path }`);
    doOpen && this.openEditor( localFullPath );
  }

  switchMode = (selectedAsset, path, fileName) => {
    if (selectedAsset) {
      this.setState({
        mode: "fx",
        selectedAsset,
        path,
        fileName
      });
    }
  }

  getTreePath () {
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
  }

  changePath = newPath => fetchImagesFromFolder(newPath)
    .then(res => {
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

  openEditor ( fullPath ) {
    const ed = atom.config.get("pickpocket.imageEditorAppName");
    if (ed) {
      exec(`open -a ${ ed } ${ fullPath }`);
    }
  }

  onOpenAssets = () => {
    exec(`open ${ this.getAssetRoot() }`);
  }

  onClose = () => {
    this.setState({mode: "pick"});
    this.props.toggle();
  }

  render () {
    const { dirs, imgs, mode, selectedAsset } = this.state;
    return mode === "pick" ?
      <PickPocket
        treePath={this.getTreePath()}
        assets={{dirs, imgs}}
        onChangePath={this.changePath}
        onClose={this.onClose}
        onImport={this.onImport}
        onOpenAssets={this.onOpenAssets}
        onSwitchMode={this.switchMode} />
      :
      <EffectPocket
        onClose={this.onClose}
        onImport={this.onImportCanvas}
        asset={selectedAsset}
       />;
  }
}

export default App;
