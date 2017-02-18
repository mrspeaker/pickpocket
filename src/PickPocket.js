"use babel";

import React from "react";
import utils from "./utils";
import Assets from "./Assets";
import PreviewImage from "./ui/PreviewImage";

const {
  Component,
  PropTypes
} = React;

class PickPocket extends Component {
  static propTypes = {
    assets: PropTypes.array.isRequired,
    assetName: PropTypes.string,
    onChangePath: PropTypes.func.isRequired,
    onSelectFile: PropTypes.func.isRequired,
  };

  state = {
    selected: [],
    fileName: "",
    path: "",
  };

  closePreview = (e) => {
    if (this.state.preview) {
      e.stopPropagation();
    }
    this.setState({
      selected: [],
      fileName: "",
    });
    this.props.onSelectFile(null);
  };

  onToggle = asset => {
    const { type, fullPath } = asset;

    if (type === "directory") {
      this.props.onChangePath(fullPath + "/");
      return;
    }

    const {fileName, path} = utils.splitPathAndFileName(fullPath);
    this.props.onSelectFile(path, fileName);

    this.setState(() => ({
      fileName,
      selected: [asset],
    }));
  };

  render() {
    const { assets, assetName } = this.props;
    const { selected } = this.state;

    return (
      <div className="screen">
        <section>
          <Assets
            assets={assets}
            selected={selected}
            onToggle={this.onToggle}
          />
          {assetName && selected.length &&
            <PreviewImage asset={selected[0]} onClose={this.closePreview} />}
        </section>

      </div>
    );
  }
}

export default PickPocket;
