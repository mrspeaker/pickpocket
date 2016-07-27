"use babel";

/* global atom */
//atom.workspace.open("atom://config/packages/pickpocket")
import React from "react";
import ReactDOM from "react-dom";
import fs from "fs";
import proc from "child_process";
const { exec } = proc;

import { CompositeDisposable } from "atom";
import PickPocket from "./PickPocket";
import fetchImagesFromFolder from "./fetchImagesFromFolder";
import utils from "./utils";

export default {
  root: null,
  modal: null,
  visible: false,
  config: {
    assetFolder: {
      type: "string",
      description: "A folder that contains a bunch of gif/png/jpgs",
      default: "/tmp/"
    },
    imageEditorAppName: {
      type: "string",
      description: "Open-in-editor application name",
      default: "aseprite"
    }
  },

  getAssetRoot () {
    let root = atom.config.get("pickpocket.assetFolder");
    if (!root.endsWith("/")) {
      root += "/";
    }
    return root;
  },

  activate () {
    const root = this.root = document.createElement("div");

    /*
    // Pretty sure this isn't how you're supposed to make
    // a modal act like a modal, but whatever...
    this.root.addEventListener( "mousedown", e => {
      //atom.views.getView( this.editor ).focus();
      e.preventDefault();
      e.stopPropagation();
    });
    */
    this.root.addEventListener("keyup", e => {
      // Handle escape key
      if (e.which !== 27) return;

      this.toggle();
    }, false);

    this.modal = atom.workspace.addModalPanel({item: root});
    this.subscriptions = new CompositeDisposable();
    this.subscriptions.add(
      atom.commands.add(
        "atom-workspace",
        { "pickpocket:toggle": () => this.toggle() }
      )
    );
  },

  forceUpdate (assets) {
    const def = {
      dirs: [],
      imgs: []
    };

    ReactDOM.render(
      this.visible ?
      <PickPocket
        treePath={this.getTreePath()}
        assets={assets || def}
        onChangePath={this.changePath.bind(this)}
        onClose={this.toggle.bind(this)}
        onImport={this.onImport.bind(this)}
        onOpenAssets={this.onOpenAssets.bind(this)}
      /> : <div></div>,
      this.root
    );
  },

  onImport (asset, path, fileName, doOpen = false) {

    //const editorElement = atom.views.getView(atom.workspace.getActiveTextEditor());
    //atom.commands.dispatch(editorElement, "settings-view:uninstall-packages");

    const dirs = atom.project.getDirectories();
    if (!dirs.length) {
      this.toggle();
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

    this.toggle();
  },

  toggle () {
    if (this.visible) {
      this.visible = false;
      this.modal.hide();
      this.forceUpdate();
      return;
    }
    this.visible = true;
    this.modal.show();
    this.forceUpdate();
    fetchImagesFromFolder(this.getAssetRoot())
      .then(res => this.forceUpdate(res))
      .catch(() => {
        atom.notifications.addError("Can't open your asset folder: update it in settings");
        this.toggle();
      });
  },

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
  },

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
      return this.forceUpdate(res);
    });
  },

  openEditor ( fullPath ) {
    const ed = atom.config.get("pickpocket.imageEditorAppName");
    if (ed) {
      exec(`open -a ${ ed } ${ fullPath }`);
    }
  },

  onOpenAssets () {
    exec(`open ${ this.getAssetRoot() }`);
  },

  deactivate () {
    ReactDOM.unmountComponentAtNode(this.root);
    this.subscriptions.dispose();
    this.modal.destroy();
  }
};
