"use babel";

/* global atom */

import React from "react";
const {
  Component,
} = React;

class MiniEditor extends Component {

  componentDidMount () {
    const editor = atom.workspace.buildTextEditor({ mini: true });
    this.refs.ed.appendChild(atom.views.getView( editor ));
  }

  componentWillUnmount () {
    // Unhook ed events
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
