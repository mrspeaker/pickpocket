"use babel";

/* global atom */

import React from "react";
import ReactDOM from "react-dom";
import { createStore } from "redux";
import getInitialState from "./stores/getInitialState";

import { CompositeDisposable } from "atom";
import PickPocket from "./PickPocket";
import fetchImagesFromFolder from "./fetchImagesFromFolder";

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
      <PickPocket store={store} assets={assets || def} />,
      this.root
    );
  },

  toggle () {
    if (this.visible) {
      this.visible = false;
      this.modal.hide();
      return;
    }
    this.visible = true;
    this.modal.show();
    this.forceUpdate();
    fetchImagesFromFolder(this.getAssetRoot())
      .then(res => this.forceUpdate(res));

  },

  deactivate () {
    ReactDOM.unmountComponentAtNode(this.root);
    this.subscriptions.dispose();
    this.modal.destroy();
  }
};
