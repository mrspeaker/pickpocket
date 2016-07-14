"use babel";

import React from "react";

const {
  Component,
} = React;

class SelectableThumbnail extends Component {

  render () {
    const { asset, selected, onToggle } = this.props;
    const { fullPath, size } = asset;

    return <div onClick={onToggle} className={`thumb ${selected ? "selected" :  ""}`}>
      <img src={fullPath} />
      <div className="meta">{ (size / 1000).toFixed(size < 1000 ? 1 : 0)}k</div>
    </div>;

  }

}

export default SelectableThumbnail;
