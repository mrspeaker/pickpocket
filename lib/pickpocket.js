"use babel";
const atom = global.atom;

import fs from "fs";
import path from "path";

import proc from "child_process";
import PickpocketView from "./pickpocket-view";
import { CompositeDisposable } from "atom";

const { exec } = proc;

export default {

  pickpocketView: null,
  modalPanel: null,
  subscriptions: null,

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

  getAssetRoot () {

    return atom.config.get( "pickpocket.assetFolder" );

  },

  serialize() {

    return {

      pickpocketViewState: this.pickpocketView.serialize()

    };

  },

  toggle( fromView ) {

    if ( this.modalPanel.isVisible() ) {

      // do view close if closed from command
      return fromView ?
        this.modalPanel.hide() :
        this.pickpocketView.onClose();

    }

    const assetRoot = this.getAssetRoot();

    // TODO: check if valid (even non-existant) dir, err if not.
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
    const assetRoot = this.getAssetRoot();
    const assetFullPath = assetRoot + assetName;
    const localFullPath = `${ projectRoot }/${ localPath }`;

    // TODO: use fs-extras copy, and error check
    fs.writeFileSync( localFullPath, fs.readFileSync( assetFullPath ) );

    atom.clipboard.write( `"${ localPath }"` );
    atom.notifications.addSuccess(`Copied ${ assetName } to ${ localPath }`);
    doOpen && this.openEditor( localFullPath );

  },

  openEditor ( fullPath ) {

    const ed = atom.config.get( "pickpocket.imageEditorAppName" );
    if ( ed ) {

      exec( `open -a ${ ed } ${ fullPath }` );

    }

  }

};
