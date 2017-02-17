"use babel";

import React from "react";
import utils from "./utils";
import Assets from "./Assets";
import MiniEditor from "./ui/MiniEditor";
import PreviewImage from "./ui/PreviewImage";
import Footer from "./ui/Footer";

const {
  Component,
  PropTypes
} = React;

const styles = {
  closeIcon: {
    cursor: "pointer",
    display: "inline-block",
    float: "right"
  }
};

class PickPocket extends Component {
  static propTypes = {
    assets: PropTypes.array.isRequired,
    onImport: PropTypes.func.isRequired,
    onClose: PropTypes.func.isRequired,
    onOpenAssets: PropTypes.func.isRequired,
    onChangePath: PropTypes.func.isRequired,
    onSwitchMode: PropTypes.func.isRequired,
    onOpenSettings: PropTypes.func.isRequired,
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
  };

  onToggle = asset => {
    const { type, fullPath } = asset;

    if (type === "directory") {
      this.props.onChangePath(fullPath + "/");
      return;
    }

    this.setState(() => ({
      fileName: utils.splitPathAndFileName(fullPath).fileName,
      preview: asset,
      selected: [asset],
      canImport: true
    }));
  };

  onImport = (edit = false) => {
    const { selected, path, fileName } = this.state;
    this.props.onImport(selected[0], path, fileName, edit === true);
  };

  componentWillReceiveProps({ treePath: path }) {
    this.setState({ path });
  }

  render() {
    const { assets, onClose, onOpenAssets, onSwitchMode, onOpenSettings } = this.props;
    const { path, fileName, selected, preview, canImport } = this.state;

    return (
      <div className="pickpocket">

        <section>
          <div className="btn-group toolbar" style={{ width: "100%" }}>
            <button
              title="import asset"
              className="btn"
              onClick={this.onImport}
              disabled={!canImport} >
              <span className="icon icon-desktop-download"></span>
            </button>
            <button
              title="import asset, then open in editor"
              className="btn"
              onClick={() => this.onImport(true)}
              disabled={!canImport} >
              <span className="icon icon-desktop-download"></span>
              <span className="icon icon-pencil"></span>
            </button>
            <button
              title="add some effects!"
              className="btn"
              onClick={() => onSwitchMode(selected[0], path, fileName)}
              disabled={!canImport} >
              <span className="icon icon-paintcan"></span>
            </button>
            <span style={{float: "left", display: "inline-block", width: 10, height:10}}>{" "}</span>
            <button className="btn" onClick={onOpenAssets} title="open asset folder">
              <span className="icon icon-file-symlink-directory"></span>
            </button>
            <button className="btn" onClick={onOpenSettings} title="go to pickpocket settings">
              <span className="icon icon-gear"></span>
            </button>
            <div
              title="close pickpocket"
              className="icon icon-x"
              onClick={onClose}
              style={styles.closeIcon}
            />
          </div>
        </section>

        <section style={{ paddingTop: 4 }}>
          <MiniEditor
            text={`${path}${fileName}`}
            onChange={this.updatePath}
            onEscape={this.closePreview}
            onEnter={this.onImport}
          />
        </section>

        <section>
          <Assets
            assets={assets}
            selected={selected}
            onToggle={this.onToggle}
          />
          {preview &&
            <PreviewImage asset={preview} onClose={this.closePreview} />}
        </section>

        <Footer />

      </div>
    );
  }
}

export default PickPocket;
