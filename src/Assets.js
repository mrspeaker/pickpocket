"use babel";

import React from "react";
import SelectableThumbnail from "./ui/SelectableThumbnail";

const {
  Component,
  PropTypes
} = React;

class Assets extends Component {

  static propTypes = {
    assets: PropTypes.array.isRequired,
    onToggle: PropTypes.func.isRequired,
    selected: PropTypes.array.isRequired
  };

  render () {
    const { assets, onToggle, selected } = this.props;

    return <div className="thumbs">{
      assets.map(asset =>
        <SelectableThumbnail
          onToggle={() => onToggle(asset)}
          src={asset.fullPath}
          selected={selected.indexOf(asset) !== -1}
        />
      )
    }</div>;

  }

}

export default Assets;
