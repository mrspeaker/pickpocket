"use babel";

/* global atom */
//atom.workspace.open("atom://config/packages/pickpocket")
import React from "react";
import ReactDOM from "react-dom";

import { CompositeDisposable } from "atom";
import App from "./App";

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

  forceUpdate () {
    /*const def = {
      dirs: [],
      imgs: []
    };*/

    /*const screen = !this.importedImage ? <PickPocket
      treePath={this.getTreePath()}
      assets={assets || def}
      onChangePath={this.changePath.bind(this)}
      onClose={this.toggle.bind(this)}
      onImport={this.onImport.bind(this)}
      onOpenAssets={this.onOpenAssets.bind(this)} />
      :
      <Effect
        onClose={this.toggle.bind(this)}
        imgPath={this.importedImage}
      />;
*/

    //ReactDOM.render(<App />, this.root);
    ReactDOM.render(
      <App toggle={() => this.toggle()} />,
      this.root);
    /*  this.visible ? screen : <div></div>,
      this.root
    );*/
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
    /*fetchImagesFromFolder(this.getAssetRoot())
      .then(res => this.forceUpdate(res))
      .catch(() => {
        atom.notifications.addError("Can't open your asset folder: update it in settings");
        this.toggle();
        atom.open({
          pathsToOpen: ["atom://config/packages/pickpocket/"]
        }, 500);
      });
    */
  },


  deactivate () {
    ReactDOM.unmountComponentAtNode(this.root);
    this.subscriptions.dispose();
    this.modal.destroy();
  }
};
