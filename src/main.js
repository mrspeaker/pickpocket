"use babel";

/* global atom */

// The base Atom plugin, that renders (or doesn't!) the App.

import React from "react";
import ReactDOM from "react-dom";

import { CompositeDisposable } from "atom";
import App from "./App";
import path from "path";

const defaultExamples = path.join(
  path.dirname(
    atom.config.getUserConfigPath()
  ),
  "packages",
  "pickpocket",
  "example");

export default {
  root: null,
  modal: null,
  visible: false,
  config: {
    assetFolder: {
      type: "string",
      description: "A folder (eg /Users/mrspeaker/assets/) that contains a bunch of gif/png/jpgs",
      default: defaultExamples
    },
    imageEditorAppName: {
      type: "string",
      description: "Open-in-editor application name",
      default: "aseprite"
    }
  },

  activate() {
    const root = this.root = document.createElement("div");
    console.log(__dirname.slice(0, -3) + "example");

    // TODO: Never removeEventListener - figure out plugin lifecycle.
    this.root.addEventListener(
      "keyup",
      e => {
        // Handle escape key
        if (e.which !== 27) return;
        this.toggle();
      },
      false
    );

    this.modal = atom.workspace.addModalPanel({ item: root });
    this.subscriptions = new CompositeDisposable();
    this.subscriptions.add(
      atom.commands.add("atom-workspace", {
        "pickpocket:toggle": () => this.toggle()
      })
    );
  },

  render() {
    ReactDOM.render(
      this.visible ? <App toggle={() => this.toggle()} /> : <div />,
      this.root
    );
  },

  toggle() {
    this.visible = !this.visible;
    this.modal[this.visible ? "show" : "hide"]();
    this.render();
  },

  deactivate() {
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

  // https://atom.io/docs/api/v1.14.2/Config#instance-getUserConfigPath will
  // get you to the `config.cson`, you can do
  // `path.join(path.dirname(atom.config.getUserConfigPath()), 'packages', 'package-name')`
  // to get the path to your package's directory ... or `__dirname` to get the
  // directory that your current file is executing from and walk up from there

  // Pretty sure this isn't how you're supposed to make
  // a modal act like a modal, but whatever...
  this.root.addEventListener( "mousedown", e => {
    //atom.views.getView( this.editor ).focus();
    e.preventDefault();
    e.stopPropagation();
  });
*/
