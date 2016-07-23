"use babel";

import React from "react";

const {
  Component,
} = React;

class SelectableFolder extends Component {

  render () {
    const { asset, onToggle, selected } = this.props;

    return <div onClick={onToggle} className={`thumb ${selected ? "selected" :  ""}`} style={{
        flexDirection: "column"
      }}>
      <div className="icon icon-file-directory light-blue" ></div>
      {asset.name}
    </div>;

  }

}

export default SelectableFolder;
