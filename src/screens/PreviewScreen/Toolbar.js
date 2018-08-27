"use babel";

import React from "react";
const { Component, PropTypes } = React;

class Toolbar extends Component {
  static propTypes = {
    onImport: PropTypes.func.isRequired
  };

  render() {
    const { onImport, isProjectAssets } = this.props;

    return (
      <div className="btn-toolbar toolbar">
        <div class="btn-group">
          {isProjectAssets && (
            <button
              title="import asset"
              className="btn icon icon-desktop-download"
              onClick={() => onImport(false)}
            >
              import
            </button>
          )}
          <button
            title="import asset, then open in editor"
            className="btn icon icon-pencil"
            onClick={() => onImport(true)}
          >
            {isProjectAssets ? "import +" : ""}edit
          </button>
        </div>

        <div class="btn-group">
          <button
            title="add some effects!"
            className="btn icon icon-paintcan"
            onClick={() => alert("temporarily disabled!")}
          >
            effects
          </button>
        </div>
      </div>
    );
  }
}

export default Toolbar;
