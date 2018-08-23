"use babel";

import React from "react";
const { Component, PropTypes } = React;

class Toolbar extends Component {
  static propTypes = {
    onOpenAssets: PropTypes.func.isRequired,
    onOpenSettings: PropTypes.func.isRequired,
    onNew: PropTypes.func.isRequired
  };

  render() {
    const { onOpenAssets, onOpenSettings, onNew, onToggleSource } = this.props;
    return (
      <div className="btn-toolbar toolbar">
        <div class="btn-group">
          <button
            title="generate new asset"
            className="btn icon icon-file"
            onClick={onNew}
          >
            generate
          </button>
        </div>

        <div class="btn-group">
          <button
            className="btn icon icon-file-symlink-directory"
            onClick={onOpenAssets}
            title="open asset folder"
          >
            open assets
          </button>
          <button
            className="btn icon icon-gear"
            onClick={onOpenSettings}
            title="go to pickpocket settings"
          >
            settings
          </button>
          <button
            className="btn icon icon-gear"
            onClick={onToggleSource}
            title="toggle source"
          >
            tog
          </button>
        </div>
      </div>
    );
  }
}

export default Toolbar;
