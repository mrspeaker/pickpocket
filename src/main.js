"use babel";

/* global atom */

// The base Atom plugin, that renders (or doesn't!) the App.

import React from "react";
import ReactDOM from "react-dom";

import { CompositeDisposable } from "atom";
import App from "./App";
import path from "path";

const defaultExamples = path.join(
  path.dirname(atom.config.getUserConfigPath()),
  "packages",
  "pickpocket",
  "example"
);

export default {
  root: null,
  modal: null,
  item: null,
  visible: false,

  config: {
    assetFolder: {
      type: "string",
      description:
        "A folder (eg /Users/mrspeaker/assets/) that contains a bunch of gif/png/jpgs",
      default: defaultExamples
    },
    imageEditorAppName: {
      type: "string",
      description: "Open-in-editor application name",
      default: "aseprite"
    }
  },

  activate() {
    const root = (this.root = document.createElement("div"));

    // this.modal = atom.workspace.addModalPanel({ item: root });
    this.subscriptions = new CompositeDisposable();
    this.subscriptions.add(
      atom.commands.add("atom-workspace", {
        "pickpocket:toggle": () => this.toggle()
      })
    );
    this.item = {
      element: root, //document.createElement('div'),
      getTitle: () => "Pickpocket",
      getURI: () => "atom://pickpocket/App",
      getDefaultLocation: () => "right"
    };
    atom.workspace.onDidOpen((a) => {
      console.log("Didi open", a);
    });
    // this.modal = atom.workspace.open(this.item).then(i => {
    //   console.log(i, "!!!");
    // })
  },

  render() {
    ReactDOM.render(
      this.visible ? <App toggle={() => this.toggle()} /> : <div />,
      this.root
    );
  },

  toggle() {
    //this.modal[this.visible ? "show" : "hide"]();
    atom.workspace.toggle(this.item).then(() => {
      this.visible = !this.visible;
      console.log(this.visible);
      this.render();
    });
  },

  deactivate() {
    ReactDOM.unmountComponentAtNode(this.root);
    this.subscriptions.dispose();
    this.modal.destroy();
  }
};
