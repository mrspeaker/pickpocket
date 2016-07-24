"use babel";

/* global atom */

import React from "react";
const {
  Component,
  PropTypes
} = React;

class MiniEditor extends Component {

  static propTypes = {
    onChange: PropTypes.func.isRequired,
    onEscape: PropTypes.func.isRequired,
    onEnter: PropTypes.func.isRequired,
  };

  componentDidMount () {
    const editor = this.editor = atom.workspace.buildTextEditor({ mini: true });
    let text = editor.getText();

    this.view = atom.views.getView(editor);

    this.view.addEventListener("blur", () => {
      const newText = editor.getText();
      if (newText !== text) {
        this.props.onChange(editor.getText());
        text = newText;
      }
    }, false);

    this.view.addEventListener("keyup", e => {
      if (e.which === 27) this.props.onEscape(e);
      if (e.which === 13) this.props.onEnter(e);
    }, false);

    this.refs.ed.appendChild(this.view);
  }

  componentWillReceiveProps ({text}) {
    // Why does it need setTimeout, dang it?!
    setTimeout(() => this.view.focus(), 0);

    this.editor.setText(text);
  }

  render () {
    return <div ref="ed" />;
  }
}

export default MiniEditor;
