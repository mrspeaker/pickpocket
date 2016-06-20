"use babel";

/* global atom */

import React from "react";
const {
  Component,
} = React;

class MiniEditor extends Component {

  componentDidMount () {
    const editor = this.editor = atom.workspace.buildTextEditor({ mini: true });
    this.view = atom.views.getView( editor );
    this.refs.ed.appendChild(this.view);
  }

  componentWillUnmount () {
    // Unhook ed events
  }

  componentWillReceiveProps ({selected, text = ""}) {
    this.editor.setText(selected ? selected.fullPath : text);
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
