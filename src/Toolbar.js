"use babel";

import React from "react";
const { Component, PropTypes } = React;

const styles = {
  closeIcon: {
    cursor: "pointer",
    display: "inline-block",
    float: "right"
  }
};

class Toolbar extends Component {
  static propTypes = {
    onClose: PropTypes.func.isRequired,
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
      onClose,
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
        <button
          title="import asset"
          className="btn"
          onClick={onImport}
          disabled={!canImport}
        >
          <span className="icon icon-desktop-download" />
        </button>
        <button
          title="import asset, then open in editor"
          className="btn"
          disabled={!canImport}
          onClick={() => onImport(true)}
        >
          <span className="icon icon-desktop-download" />
          <span className="icon icon-pencil" />
        </button>
        {mode === "pick" ? (
          <span>
            <button
              title="add some effects!"
              className="btn"
              disabled={!canImport}
              onClick={onSwitchMode}
            >
              <span className="icon icon-paintcan" />
            </button>
            <button title="create new asset" className="btn" onClick={onNew}>
              <span className="icon icon-file" />
            </button>
          </span>
        ) : (
          <button
            title="back to picking"
            className="btn"
            onClick={onSwitchMode}
          >
            <span className="icon icon-arrow-left" />
          </button>
        )}

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
        <div
          title="close pickpocket"
          className="icon icon-x"
          onClick={onClose}
          style={styles.closeIcon}
        />
      </div>
    );
  }
}

export default Toolbar;
