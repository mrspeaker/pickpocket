"use babel";

/* global atom */

import React from "react";
const {
  Component,
} = React;

class MiniEditor extends Component {

  componentDidMount () {
    const editor = this.editor = atom.workspace.buildTextEditor({ mini: true });
    let text = editor.getText();
    /*editor.onDidStopChanging(() => {});*/
    this.view = atom.views.getView( editor );
    this.view.addEventListener("blur", () => {
      const newText = editor.getText();
      if (newText !== text) {
        this.props.onChange(editor.getText());
        text = newText;
      }
    }, false);
    this.refs.ed.appendChild(this.view);
  }

  componentWillUnmount () {
    // Unhook ed events
    //this.editor = null;
  }

  componentWillReceiveProps ({text}) {
    this.editor.setText(text);
  }

  shouldComponentUpdate () {
    // When editor updates
    return false;
  }

  render () {
    return <div ref="ed" />;
  }
}

export default MiniEditor;
