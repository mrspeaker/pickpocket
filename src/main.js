"use babel";

/* global atom */
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

    // TODO: Never removeEventListener - figure out plugin lifecycle.
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

  render () {
    ReactDOM.render(
      <App toggle={() => this.toggle()} />,
      this.root);
  },

  toggle () {
    this.visible = !this.visible;
    this.modal[this.visible ? "show" : "hide"]();
    this.render();
  },

  deactivate () {
    ReactDOM.unmountComponentAtNode(this.root);
    this.subscriptions.dispose();
    this.modal.destroy();
  }
};

/*
  // atom functions...

  atom.workspace.open("atom://config/packages/pickpocket")
  atom.notifications.addError("Can't open your asset folder: update it in settings");
  atom.open({ pathsToOpen: ["atom://config/packages/pickpocket/"]}, 500);
  //const editorElement = atom.views.getView(atom.workspace.getActiveTextEditor());
  //atom.commands.dispatch(editorElement, "settings-view:uninstall-packages");
  //atom://config/packages/pickpocket


  // Pretty sure this isn't how you're supposed to make
  // a modal act like a modal, but whatever...
  this.root.addEventListener( "mousedown", e => {
    //atom.views.getView( this.editor ).focus();
    e.preventDefault();
    e.stopPropagation();
  });
*/
