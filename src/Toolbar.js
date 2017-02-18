"use babel";
/* global atom */

import React from "react";
import proc from "child_process";
const { exec } = proc;

const {
  Component,
} = React;

const styles = {
  closeIcon: {
    cursor: "pointer",
    display: "inline-block",
    float: "right"
  }
};

class Toolbar extends Component {

  render () {
    const {onClose, onOpenAssets, onOpenSettings, onImport, onSwitchMode} = this.props;

    return <div className="btn-group toolbar" style={{ width: "100%" }}>
      <button
        title="import asset"
        className="btn"
        onClick={onImport} >
        <span className="icon icon-desktop-download"></span>
      </button>
      <button
        title="import asset, then open in editor"
        className="btn"
        onClick={() => onImport(true)} >
        <span className="icon icon-desktop-download"></span>
        <span className="icon icon-pencil"></span>
      </button>
      <button
        title="add some effects!"
        className="btn"
        onClick={onSwitchMode} >
        <span className="icon icon-paintcan"></span>
      </button>
      <span style={{float: "left", display: "inline-block", width: 10, height:10}}>{" "}</span>
      <button className="btn" onClick={onOpenAssets} title="open asset folder">
        <span className="icon icon-file-symlink-directory"></span>
      </button>
      <button className="btn" onClick={onOpenSettings} title="go to pickpocket settings">
        <span className="icon icon-gear"></span>
      </button>
      <div
        title="close pickpocket"
        className="icon icon-x"
        onClick={onClose}
        style={styles.closeIcon}
      />
    </div>;
  }
}

export default Toolbar;
