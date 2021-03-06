"use babel";

import React from "react";
const { Component, PropTypes } = React;

class Toolbar extends Component {
  static propTypes = {
    onImport: PropTypes.func.isRequired,
    onFx: PropTypes.func.isRequired,
    onClose: PropTypes.func.isRequired
  };

  render() {
    const { onImport, pickFromAssets, onFx, onClose } = this.props;

    return (
      <div className="btn-toolbar toolbar">
        <div class="btn-group">
          <button
            title="back"
            className="btn icon icon-reply"
            onClick={() => onClose()}
          />
          <button
            title="import asset"
            className="btn icon icon-desktop-download"
            onClick={() => onImport(false)}
          >
            save
          </button>
          <button
            title="import asset, then open in editor"
            className="btn icon icon-pencil"
            onClick={() => onImport(true)}
          >
            {pickFromAssets ? "save + open" : "open"}
          </button>
        </div>

        <div class="btn-group">
          <button
            title="add some effects!"
            className="btn icon icon-paintcan"
            onClick={onFx}
          >
            effects
          </button>
        </div>
      </div>
    );
  }
}

export default Toolbar;
