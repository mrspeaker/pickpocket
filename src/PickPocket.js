"use babel";

import React from "react";
import utils from "./utils";
import Assets from "./Assets";
import MiniEditor from "./ui/MiniEditor";
import PreviewImage from "./ui/PreviewImage";

const {
  Component,
  PropTypes
} = React;

class PickPocket extends Component {
  static propTypes = {
    assets: PropTypes.array.isRequired,
    onChangePath: PropTypes.func.isRequired,
    onSelectFile: PropTypes.func.isRequired,
    treePath: PropTypes.string
  };

  state = {
    selected: [],
    preview: null,
    fileName: "",
    path: "",
    canImport: false
  };

  isSelected = asset => this.state.selected.indexOf(asset) !== -1;

  updatePath = text => {
    const { path, fileName } = utils.splitPathAndFileName(text);
    this.setState({
      path,
      fileName
    });
  };

  closePreview = (e) => {
    if (this.state.preview) {
      e.stopPropagation();
    }
    this.setState({
      preview: null,
      fileName: "",
      canImport: false
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
      preview: asset,
      selected: [asset],
      canImport: true
    }));
  };

  // onImport = (edit = false) => {
  //   const { selected, path, fileName } = this.state;
  //   this.props.onImport(selected[0], path, fileName, edit === true);
  // };

  componentWillReceiveProps({ treePath: path }) {
    this.setState({ path });
  }

  render() {
    const { assets, assetName } = this.props;
    const { path, fileName, selected, preview } = this.state;

    return (
      <div className="screen">
        <section>
          <Assets
            assets={assets}
            selected={selected}
            onToggle={this.onToggle}
          />
          {assetName &&
            <PreviewImage asset={preview} onClose={this.closePreview} />}
        </section>

      </div>
    );
  }
}

export default PickPocket;
