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
    const {
      onOpenAssets,
      onOpenSettings,
      onNew,
      onToggleSource,
      pickFromAssets
    } = this.props;
    return (
      <div className="btn-toolbar toolbar">

        <div class="btn-group">
          <button
            className="btn icon icon-file-symlink-directory"
            onClick={onOpenAssets}
            title="open asset folder"
          >
            open assets
          </button>
        </div>
      </div>
    );
  }
}

export default Toolbar;
