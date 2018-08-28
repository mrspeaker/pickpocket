"use babel";
/* global atom */

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
    assetName: PropTypes.string,
    onChangePath: PropTypes.func.isRequired,
    onSelectFile: PropTypes.func.isRequired
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
    this.props.onSelectFile(null);
  };

  onToggle = asset => {
    const { type, fullPath } = asset;

    if (type === "directory") {
      this.props.onChangePath(fullPath + "/");
      return;
    }

    const { fileName, path } = utils.splitPathAndFileName(fullPath);
    this.props.onSelectFile(path, fileName);

    this.setState(() => ({
      selected: [asset]
    }));
  };

  onOpenSettings = () => {
    atom.workspace.open("atom://config/packages/pickpocket");
    this.props.onClose();
  };

  render() {
    const {
      assets,
      assetName,
      onImport,
      onOpenAssets,
      onNew,
      onToggleSource,
      pickFromAssets
    } = this.props;
    const { selected } = this.state;
    const showPreview = assetName && selected.length;
    const noLocalImages =
      !pickFromAssets && assets.dirs.length === 0 && assets.imgs.length === 0;
    return (
      <div className="screen">
        <section>
          <Toolbar
            onOpenSettings={this.onOpenSettings}
            onOpenAssets={onOpenAssets}
            onNew={onNew}
            onToggleSource={onToggleSource}
            pickFromAssets={pickFromAssets}
          />
        </section>
        <section style={styles.scroll}>
          <Assets
            assets={assets}
            selected={selected}
            onToggle={this.onToggle}
          />
          {noLocalImages ? (
            <div className="text-subtle component-padding">
              No images found in the current project
            </div>
          ) : null}
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
