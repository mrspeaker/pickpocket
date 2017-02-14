"use babel";
/* global atom */

import React from "react";
import PickPocket from "./PickPocket";
import EffectPocket from "./EffectPocket";

import fs from "fs";
import proc from "child_process";
const { exec } = proc;
import fetchImagesFromFolder from "./file/fetchImagesFromFolder";
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
      });
  }

  getAssetRoot () {
    let root = atom.config.get("pickpocket.assetFolder");
    if (!root.endsWith("/")) {
      root += "/";
    }
    return root;
  }

  onImport = (asset, path, fileName, doOpen = false) => {
    const dirs = atom.project.getDirectories();
    if (!dirs.length) {
      this.props.toggle();
      atom.notifications.addError("Not in a project - can't copy here.");
      return;
    }
    const projectRoot = dirs[ 0 ].path;
    const localFullDir = `${ projectRoot }${ path }`;
    const localPathAndName = `${ path }${fileName}`;
    const localFullPath = `${ projectRoot }${ localPathAndName }`;

    // Test if path is legit
    fs.stat(localFullDir, err => {
      if (err) {
        // Folder don't exist...
        atom.notifications.addError(`Path ${ path } does not exist.`);
        return;
      }

      // Check if local file already exists
      fs.stat(localFullPath, (err, stats) => {
        ////stats.isDirectory()
        if (stats && stats.isFile()) {
          if (!confirm(`overwrite ${localPathAndName}?`)) {
            return;
          }
        }

        // All good...
        // TODO: use fs-extras copy, and error check
        fs.writeFileSync(localFullPath, fs.readFileSync(asset.fullPath));
        atom.clipboard.write( `"${ localPathAndName }"` );
        atom.notifications.addSuccess(`Copied ${ fileName } to ${ path }`);
        doOpen && this.openEditor( localFullPath );
      });
    });

    this.props.toggle();
  };

  // TODO: refactor with regular import
  onImportCanvas = (canvas) => {
    const {path, fileName} = this.state;
    const imgData = canvas.toDataURL("image/png");
    const dirs = atom.project.getDirectories();
    if (!dirs.length) {
      this.props.toggle();
      atom.notifications.addError("Not in a project - can't copy here.");
      return;
    }
    const projectRoot = dirs[ 0 ].path;
    const localFullDir = `${ projectRoot }${ path }`;
    const localPathAndName = `${ path }${fileName}`;
    const localFullPath = `${ projectRoot }${ localPathAndName }`;

    // Test if path is legit
    fs.stat(localFullDir, err => {
      if (err) {
        // Folder don't exist...
        atom.notifications.addError(`Path ${ path } does not exist.`);
        return;
      }

      // Check if local file already exists
      fs.stat(localFullPath, (err, stats) => {
        ////stats.isDirectory()
        if (stats && stats.isFile()) {
          if (!confirm(`overwrite ${localPathAndName}?`)) {
            return;
          }
        }

        // All good...
        // TODO: use fs-extras copy, and error check
        //fs.writeFileSync(localFullPath, fs.readFileSync(asset.fullPath));
        const data = imgData.replace(/^data:image\/\w+;base64,/, "");
        const buf = new Buffer(data, "base64");
        fs.writeFile(localFullPath, buf);
        atom.notifications.addSuccess(`Copied ${ fileName } to ${ path }`);
        atom.clipboard.write( `"${ localPathAndName }"` );
      });
    });

    this.setState({mode: "pick"});
    this.props.toggle();
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

  changePath = (newPath) => {
    return fetchImagesFromFolder(newPath).then(res => {
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
  }

  openEditor ( fullPath ) {
    const ed = atom.config.get("pickpocket.imageEditorAppName");
    if (ed) {
      exec(`open -a ${ ed } ${ fullPath }`);
    }
  }

  onOpenAssets () {
    exec(`open ${ this.getAssetRoot() }`);
  }

  render () {
    const { toggle } = this.props;
    const { dirs, imgs, mode, selectedAsset } = this.state;
    return mode === "pick" ?
      <PickPocket
        treePath={this.getTreePath()}
        assets={{dirs, imgs}}
        onChangePath={this.changePath}
        onClose={toggle}
        onImport={this.onImport}
        onOpenAssets={() => this.onOpenAssets()}
        onSwitchMode={this.switchMode} />
      :
      <EffectPocket
        onClose={() => { this.setState({mode: "pick"}); toggle(); }}
        onImport={this.onImportCanvas}
        asset={selectedAsset}
       />;
  }
}

export default App;
