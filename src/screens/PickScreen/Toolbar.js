"use babel";

import React from "react";
const { Component, PropTypes } = React;

class Toolbar extends Component {
  static propTypes = {
    onOpenAssets: PropTypes.func.isRequired,
    onOpenSettings: PropTypes.func.isRequired,
    onImport: PropTypes.func.isRequired,
    onNew: PropTypes.func.isRequired,
    onSwitchMode: PropTypes.func.isRequired,
    canImport: PropTypes.bool,
    mode: PropTypes.string
  };

  render() {
    const {
      onOpenAssets,
      onOpenSettings,
      onImport,
      onNew,
      onSwitchMode,
      canImport,
      mode
    } = this.props;

    return (
      <div className="btn-group toolbar" style={{ width: "100%" }}>
        <button title="create new asset" className="btn" onClick={onNew}>
          <span className="icon icon-file" />
        </button>
        <span
          style={{
            float: "left",
            display: "inline-block",
            width: 10,
            height: 10
          }}
        >
          {" "}
        </span>
        <button
          className="btn"
          onClick={onOpenAssets}
          title="open asset folder"
        >
          <span className="icon icon-file-symlink-directory" />
        </button>
        <button
          className="btn"
          onClick={onOpenSettings}
          title="go to pickpocket settings"
        >
          <span className="icon icon-gear" />
        </button>

      </div>
    );
  }
}

export default Toolbar;
