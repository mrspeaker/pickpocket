"use babel";

import React from "react";
const { Component, PropTypes } = React;

class Toolbar extends Component {
  static propTypes = {
    onImport: PropTypes.func.isRequired
  };

  render() {
    const { onImport } = this.props;

    return (
      <div className="btn-group toolbar" style={{ width: "100%" }}>
        <button
          title="import asset"
          className="btn"
          onClick={onImport}
        >
          <span className="icon icon-desktop-download" />
        </button>
        <button
          title="import asset, then open in editor"
          className="btn"
          onClick={() => onImport(true)}
        >
          <span className="icon icon-desktop-download" />
          <span className="icon icon-pencil" />
        </button>

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

        <span style={{ float: "left", display: "inline-block" }}>
          <button
            title="add some effects!"
            className="btn"
            onClick={() => alert("temporarily disabled!")}
          >
            <span className="icon icon-paintcan" />
          </button>
        </span>
      </div>
    );
  }
}

export default Toolbar;
