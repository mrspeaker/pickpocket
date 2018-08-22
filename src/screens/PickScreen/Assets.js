"use babel";

import React from "react";
import SelectableThumbnail from "../../ui/SelectableThumbnail";
import SelectableFolder from "../../ui/SelectableFolder";

const { Component, PropTypes } = React;

class Assets extends Component {
  static propTypes = {
    assets: PropTypes.array.isRequired,
    onToggle: PropTypes.func.isRequired,
    selected: PropTypes.array.isRequired
  };

  render() {
    const { assets, onToggle, selected } = this.props;
    const { dirs, imgs } = assets;

    return (
      <div className="thumbs">
        {[...dirs, ...imgs].map(
          asset =>
            asset.type === "directory" ? (
              <SelectableFolder
                onToggle={() => onToggle(asset)}
                name={asset.name}
                selected={selected.indexOf(asset) !== -1}
              />
            ) : (
              <SelectableThumbnail
                onToggle={() => onToggle(asset)}
                src={asset.fullPath}
                selected={selected.indexOf(asset) !== -1}
              />
            )
        )}
      </div>
    );
  }
}

export default Assets;
