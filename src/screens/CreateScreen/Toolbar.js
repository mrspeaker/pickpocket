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
    const { onImport, onBack } = this.props;

    return (
      <div className="btn-toolbar toolbar">
        <div class="btn-group">
          <button
            title="back"
            className="btn icon icon-mail-reply"
            onClick={onBack}
          >
            back
          </button>
        </div>

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
