"use babel";

/* global atom */

import React from "react";
const { Component, PropTypes } = React;

class MiniEditor extends Component {
  static propTypes = {
    onChange: PropTypes.func.isRequired,
    onEscape: PropTypes.func.isRequired,
    onEnter: PropTypes.func.isRequired,
    range: PropTypes.array
  };

  state = {
    editor: null,
    view: null
  };

  componentDidMount() {
    const { text, range } = this.props;

    const editor = atom.workspace.buildTextEditor({ mini: true });
    const view = atom.views.getView(editor);

    editor.setText(text);
    if (range) {
      editor.setSelectedBufferRange([[0, range[0]], [0, range[1]]]);
    }
    setTimeout(() => view.focus(), 0);

    let lastText = editor.getText();
    view.addEventListener(
      "blur",
      () => {
        const newText = editor.getText();
        if (newText !== lastText) {
          this.props.onChange(editor.getText());
          lastText = newText;
        }
      },
      false
    );

    view.addEventListener(
      "keyup",
      e => {
        if (e.which === 27) this.props.onEscape(e);
        if (e.which === 13) {
          this.props.onChange(editor.getText());
          this.props.onEnter(e);
        }
      },
      false
    );

    this.refs.ed.appendChild(view);

    this.setState({ editor, view });
  }

  // componentDidReceiveProps({ text, range }) {
  //   // Why does it need setTimeout, dang it?!
  //   const { view, editor } = this.state;
  //   console.log("again", text, view, editor);
  //
  //   editor.setText(text);
  //   setTimeout(() => {
  //     //view.focus();
  //     this.forceUpdate();
  //   }, 10);
  //
  //   if (range) {
  //     editor.setSelectedBufferRange([[0, range[0]], [0, range[1]]]);
  //   }
  // }

  render() {
    return <div ref="ed" />;
  }
}

export default MiniEditor;
