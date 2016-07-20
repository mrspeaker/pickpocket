"use babel";

import React from "react";

const {
  Component,
} = React;

class SelectableThumbnail extends Component {

  render () {
    const { asset, selected, onToggle, onPreview } = this.props;
    const { fullPath, size } = asset;

    return <div onClick={onToggle} onDoubleClick={onPreview} className={`thumb ${selected ? "selected" :  ""}`}>
      <img src={fullPath} />
      <div className="meta">{ (size / 1000).toFixed(size < 1000 ? 1 : 0)}K</div>
    </div>;

  }

}

export default SelectableThumbnail;
