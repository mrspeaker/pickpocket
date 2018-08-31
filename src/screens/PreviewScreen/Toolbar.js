"use babel";

import React from "react";
const { Component, PropTypes } = React;

class Toolbar extends Component {
  static propTypes = {
    onImport: PropTypes.func.isRequired,
    onFx: PropTypes.func.isRequired
  };

  render() {
    const { onImport, pickFromAssets, onFx } = this.props;

    return (
      <div className="btn-toolbar toolbar">
        <div class="btn-group">
          <button
            title="import asset"
            disabled={!pickFromAssets}
            className="btn icon icon-desktop-download"
            onClick={() => onImport(false)}
          >
            {pickFromAssets ? "import" : "save as"}
          </button>
          <button
            title="import asset, then open in editor"
            className="btn icon icon-pencil"
            onClick={() => onImport(true)}
          >
            {pickFromAssets ? "import + edit" : "edit"}
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
