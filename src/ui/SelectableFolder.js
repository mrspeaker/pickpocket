"use babel";

import React from "react";

const {
  Component,
} = React;

class SelectableFolder extends Component {

  render () {
    const { dir, onToggle, selected } = this.props;

    return <div onClick={onToggle} className={`thumb ${selected ? "selected" :  ""}`}>
      {dir.name}
    </div>;

  }

}

export default SelectableFolder;
