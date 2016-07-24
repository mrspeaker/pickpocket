"use babel";

import React from "react";

const {
  Component,
} = React;

const styles = {
  container: {
    flexDirection: "column"
  },
  icon: {
    marginBottom: 5
  }
};

class SelectableFolder extends Component {

  render () {
    const { asset, onToggle, selected } = this.props;
    const className = `thumb ${selected ? "selected" :  ""}`;

    return <div onClick={onToggle} className={className} style={styles.container}>
      <img src="atom://pickpocket/res/folder.png" style={styles.icon} />
      {asset.name}
    </div>;

  }

}

export default SelectableFolder;
