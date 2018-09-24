"use babel";

import React from "react";
const { Component, PropTypes } = React;

class Toolbar extends Component {
  static propTypes = {
    onImport: PropTypes.func.isRequired,
  };

  render() {
    const { onImport } = this.props;

    return (
      <div className="btn-toolbar toolbar">
        <div class="btn-group">
          <button
            title="import asset"
            className="btn icon icon-desktop-download"
            onClick={() => onImport(false)}
          >
            import
          </button>
          <button
            title="import asset and open in editor"
            className="btn icon icon-desktop-download"
            onClick={() => onImport(true)}
          >
            import + open
          </button>
        </div>
      </div>
    );
  }
}

export default Toolbar;
