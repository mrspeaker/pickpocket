/* global atom */

"use babel";

import React from "react";
import PickPocket from "./PickPocket";
//import Effect from "./Effect";

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
    imgs: []
  };

  constructor () {
    super();
    fetchImagesFromFolder(this.getAssetRoot())
      .then(({dirs, imgs}) => {
        this.setState({
          dirs,
          imgs
        });
      });

    this.changePath = this.changePath.bind(this);
  }

  getAssetRoot () {
    let root = atom.config.get("pickpocket.assetFolder");
    if (!root.endsWith("/")) {
      root += "/";
    }
    return root;
  }

  onImport = (asset, path, fileName, doOpen = false) => {
    //const editorElement = atom.views.getView(atom.workspace.getActiveTextEditor());
    //atom.commands.dispatch(editorElement, "settings-view:uninstall-packages");
    //atom://config/packages/pickpocket

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
        this.importedImage = asset.fullPath;
      });
    });

    this.props.toggle();

  };

  getTreePath () {
    // Grab current path from tree-view
    const tree = atom.packages.getActivePackage("tree-view");
    if ( !tree ) {
      return "";
    }
    const { treeView } = tree.mainModule;
    if (!treeView) {
      return "";
    }
    const { selectedPath } = treeView;
    if ( !selectedPath ) {
      return "";
    }
    const isFile = !!( treeView.entryForPath( selectedPath ).file );
    const folderPath = !isFile ? selectedPath : selectedPath.split( "/").slice( 0, -1 ).join( "/" );
    const [ , relativePath ] = atom.project.relativizePath( folderPath );
    const trailing = relativePath ? "/" : "";
    return `/${ relativePath }${ trailing }`;
  }

  changePath (newPath) {
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
    return <PickPocket
      treePath={this.getTreePath()}
      assets={this.state}
      onChangePath={this.changePath}
      onClose={this.props.toggle}
      onImport={this.onImport}
      onOpenAssets={() => this.onOpenAssets()} />;
  }
}

export default App;
