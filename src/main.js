"use babel";

/* global atom */

import React from "react";
import ReactDOM from "react-dom";
import fs from "fs";
import proc from "child_process";
const { exec } = proc;

import { createStore } from "redux";
import getInitialState from "./stores/getInitialState";

import { CompositeDisposable } from "atom";
import PickPocket from "./PickPocket";
import fetchImagesFromFolder from "./fetchImagesFromFolder";
import utils from "./utils";

const store = createStore(getInitialState);

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
    return atom.config.get( "pickpocket.assetFolder" );
  },

  activate () {
    const root = this.root = document.createElement("div");

    this.modal = atom.workspace.addModalPanel({item: root});
    this.subscriptions = new CompositeDisposable();
    this.subscriptions.add(
      atom.commands.add(
        "atom-workspace",
        { "pickpocket:toggle": () => this.toggle() } ) );
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
        store={store}
        assets={assets || def}
        onChangePath={this.changePath.bind(this)}
        onClose={this.toggle.bind(this)}
        onImport={this.onImport.bind(this)}
      /> : <div></div>,
      this.root
    );
  },

  onImport (asset, path, fileName, doOpen = false) {

    const projectRoot = atom.project.getDirectories()[ 0 ].path;
    const localPathAndName = `${ path }${fileName}`;
    const localFullPath = `${ projectRoot }${ localPathAndName }`;

    // TODO: use fs-extras copy, and error check
    fs.writeFileSync( localFullPath, fs.readFileSync( asset.fullPath ) );
    atom.clipboard.write( `"${ localPathAndName }"` );
    atom.notifications.addSuccess(`Copied ${ fileName } to ${ path }`);
    doOpen && this.openEditor( localFullPath );

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
      .then(res => this.forceUpdate(res));
  },

  getTreePath () {
    // Grab current path from tree-view
    const tree = atom.packages.getActivePackage("tree-view");
    if ( !tree ) {
      return "";
    }
    const { treeView } = tree.mainModule;
    const { selectedPath } = treeView;
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

  deactivate () {
    ReactDOM.unmountComponentAtNode(this.root);
    this.subscriptions.dispose();
    this.modal.destroy();
  }
};
