"use babel";

import React from "react";
import utils from "../../utils";

import Toolbar from "./Toolbar";
import Assets from "./Assets";
import PreviewScreen from "../PreviewScreen";

const { Component, PropTypes } = React;

const styles = {
  scroll: {
    overflowY: "auto"
  }
};

class PickPocket extends Component {
  static propTypes = {
    assets: PropTypes.array.isRequired,
    onImport: PropTypes.func.isRequired,
    pickFromAssets: PropTypes.bool
  };

  state = {
    selected: []
  };

  closePreview = e => {
    if (this.state.preview) {
      e.stopPropagation();
    }
    this.setState({
      selected: []
    });
  };

  onAssetSelect = asset => {
    const { type, fullPath } = asset;

    if (type === "directory") {
      this.props.onChangePath(fullPath + "/");
      return;
    }

    this.setState(() => ({
      selected: [asset]
    }));
  };

  render() {
    const { assets, onImport, pickFromAssets } = this.props;
    const { selected } = this.state;
    const showPreview = selected.length;
    const noLocalImages =
      !pickFromAssets && assets.dirs.length === 0 && assets.imgs.length === 0;
    return (
      <div className="screen">
        <section style={styles.scroll}>
          {noLocalImages ? (
            <div className="text-subtle component-padding">
              <div>{"No images found in the current project"}</div>
              <div>{"Import some from your Pocket!"}</div>
            </div>
          ) : null}
          <Assets
            assets={assets}
            selected={selected}
            onToggle={this.onAssetSelect}
          />
        </section>
        {showPreview ? (
          <PreviewScreen
            asset={selected[0]}
            onClose={this.closePreview}
            onImport={onImport}
            pickFromAssets={pickFromAssets}
          />
        ) : null}
      </div>
    );
  }
}

export default PickPocket;
