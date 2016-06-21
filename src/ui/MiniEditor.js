"use babel";

/* global atom */

import React from "react";
const {
  Component,
} = React;

class MiniEditor extends Component {

  componentDidMount () {
    const editor = this.editor = atom.workspace.buildTextEditor({ mini: true });
    editor.onDidStopChanging(() => this.props.onChange(editor.getText()));
    this.view = atom.views.getView( editor );
    this.refs.ed.appendChild(this.view);
  }

  componentWillUnmount () {
    // Unhook ed events
  }

  componentWillReceiveProps ({selected, text = ""}) {
    this.editor.setText(text + ":" + (selected ? selected.fullPath : ""));
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
