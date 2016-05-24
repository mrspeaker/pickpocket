"use babel";
const atom = global.atom;
const assetRoot = "/Users/mrspeaker/assets/"; // Move to settings

import fs from "fs";
import path from "path";


console.log(fs);

import proc from "child_process";
import PickpocketView from "./pickpocket-view";
import { CompositeDisposable } from "atom";

const { exec } = proc;

export default {

  pickpocketView: null,
  modalPanel: null,
  subscriptions: null,

  activate( state ) {

    this.pickpocketView = new PickpocketView(
      state.pickpocketViewState,
      this.toggle.bind( this ),
      this.onChoosed.bind( this ) );

    this.modalPanel = atom.workspace.addModalPanel({
      item: this.pickpocketView.getElement(),
      visible: false
    });

    // Events subscribed to in atom's system can be easily cleaned up with a CompositeDisposable
    this.subscriptions = new CompositeDisposable();
    this.subscriptions.add(
      atom.commands.add(
        "atom-workspace",
        { "pickpocket:toggle": () => this.toggle() } ) );

  },

  deactivate() {

    this.modalPanel.destroy();
    this.subscriptions.dispose();
    this.pickpocketView.destroy();

  },

  serialize() {

    return {

      pickpocketViewState: this.pickpocketView.serialize()

    };

  },

  toggle() {

    if ( this.modalPanel.isVisible() ) {

      return this.modalPanel.hide();

    }

    fs.readdir(assetRoot, ( err, files ) => {

      let dirs = [];
      let imgs = [];

      files.forEach( f => {
        const fullPath = assetRoot + f;
        const file = fs.statSync( fullPath );
        if ( file.isDirectory() ) {

          dirs.push( {
            type: "directory",
            size: file.size,
            fullPath,
            name: f
          } );

          return;

        }

        const ext = path.extname( f );
        if ( [ ".png", ".jpg", ".gif" ].indexOf( ext ) !== -1 ) {

          imgs.push( {
            type: "image",
            size: file.size,
            fullPath,
            name: f
          } );

        }
        return null;
      });

      this.pickpocketView.setThumbs( dirs, imgs, assetRoot );
      this.modalPanel.show();

    });
  },

  onChoosed ( localPath, assetName, doOpen ) {

    const projectRoot = atom.project.getDirectories()[ 0 ].path;
    const assetFullPath = assetRoot + assetName;
    const localFullPath = `${ projectRoot }/${ localPath }`;

    // TODO: use fs-extras copy, and error check
    fs.writeFileSync( localFullPath, fs.readFileSync( assetFullPath ) );

    atom.clipboard.write( `"${ localPath }"` );
    doOpen && this.openEditor( localFullPath );

  },

  openEditor ( fullPath ) {

    exec( `open -a aseprite ${ fullPath }` );

  }

};
