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
    const { onOpenAssets, onOpenSettings, onNew } = this.props;

    return (
      <div className="btn-toolbar toolbar">
        <div class="btn-group">
          <button
            title="create new asset"
            className="btn icon icon-file"
            onClick={onNew}
          >
            create
          </button>
        </div>

        <div class="btn-group">
          <button
            className="btn icon icon-file-symlink-directory"
            onClick={onOpenAssets}
            title="open asset folder"
          >
            go to assets
          </button>
          <button
            className="btn icon icon-gear"
            onClick={onOpenSettings}
            title="go to pickpocket settings"
          >
            settings
          </button>
        </div>
      </div>
    );
  }
}

export default Toolbar;
