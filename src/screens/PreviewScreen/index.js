"use babel";

import React from "react";
import utils from "../../utils";

import Toolbar from "./Toolbar";
import MiniEditor from "../../ui/MiniEditor";
import PreviewImage from "../../ui/PreviewImage";

import Effector from "../../ui/Effector";

const { Component, PropTypes } = React;

class PreviewScreen extends Component {
  static propTypes = {
    asset: PropTypes.object.isRequired,
    onClose: PropTypes.func.isRequired
  };

  state = {
    fileName: null,
    showFx: false
  };

  onChangeFileName = text => {
    this.setState({
      fileName: text
    });
  };

  onImport = doEdit => {
    const { props, state }  = this;
    const { asset } = props;
    const { fileName } = state;
    props.onImport(asset, fileName, doEdit);
    props.onClose();
  };

  onFx = () => {
    const { showFx } = this.state;
    this.setState({
      showFx: !showFx
    });
  };

  render() {
    const { asset, onClose, pickFromAssets } = this.props;
    const { showFx } = this.state;
    const fileName = this.state.fileName || asset.name;
    return (
      <section className="fs-overlay">
        <Toolbar
          mode={"pick"}
          onImport={this.onImport}
          onFx={this.onFx}
          pickFromAssets={pickFromAssets}
        />
        <section className="textContainer">
          <MiniEditor
            text={fileName}
            range={fileName === asset.name ? [0, fileName.length - 4] : null}
            onChange={this.onChangeFileName}
            onEscape={onClose}
            onEnter={() => {}}
          />
        </section>

        {showFx ? <Effector asset={asset} /> : null}

        <div onClick={onClose} style={{ position: "relative", height: "100%" }}>
          <PreviewImage asset={asset} />
        </div>
      </section>
    );
  }
}

export default PreviewScreen;
