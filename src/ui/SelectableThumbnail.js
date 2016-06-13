"use babel";

import React from "react";

const {
  Component,
} = React;

class SelectableThumbnail extends Component {

  render () {
    const { src, selected } = this.props;

    return <div className={`thumb ${selected ? "selected" :  ""}`}>
      <img src={src} />
    </div>;

  }

}

export default SelectableThumbnail;
