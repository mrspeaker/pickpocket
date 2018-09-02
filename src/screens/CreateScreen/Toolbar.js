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
        </div>
      </div>
    );
  }
}

export default Toolbar;
