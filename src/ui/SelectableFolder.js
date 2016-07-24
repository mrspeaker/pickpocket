"use babel";

import React from "react";

const {
  Component,
  PropTypes,
} = React;

const styles = {
  container: {
    flexDirection: "column"
  },
  icon: {
    marginBottom: 5
  },
};

class SelectableFolder extends Component {

  static propTypes = {
    name: PropTypes.string.isRequired,
    selected: PropTypes.bool.isRequired,
    onToggle: PropTypes.func.isRequired,
  };

  render () {
    const { name, onToggle, selected } = this.props;
    const className = `thumb ${selected ? "selected" :  ""}`;

    return <div onClick={onToggle} className={className} style={styles.container}>
      <img src="atom://pickpocket/res/folder.png" style={styles.icon} />
      {name}
    </div>;

  }

}

export default SelectableFolder;
