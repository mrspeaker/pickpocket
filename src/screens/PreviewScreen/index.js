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
    canvas: null,
    showFx: false,
    isEffected: false
  };

  componentDidMount() {
    this.setState({
      fileName: this.props.asset.name
    });
  }

  onChangeFileName = text => {
    this.setState({
      fileName: text
    });
  };

  onEffect = canvas => {
    this.setState({ canvas: canvas.toDataURL(), isEffected: true });
  };

  onImport = doEdit => {
    const { props, state } = this;
    const { asset } = props;
    const { fileName, isEffected, canvas } = state;

    if (isEffected) {
      props.onImportCanvas(canvas, fileName, doEdit);
    } else {
      props.onImport(asset, fileName, doEdit);
    }
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
    const { showFx, canvas, fileName } = this.state;
    const displayName = fileName || asset.name;
    return (
      <section className="fs-overlay">
        <Toolbar
          mode={"pick"}
          onImport={this.onImport}
          onClose={onClose}
          onFx={this.onFx}
          pickFromAssets={pickFromAssets}
        />
        <section className="textContainer">
          <MiniEditor
            text={displayName}
            range={displayName === asset.name ? [0, displayName.length - 4] : null}
            onChange={this.onChangeFileName}
            onEscape={onClose}
            onEnter={() => {}}
          />
        </section>

        {showFx ? <Effector asset={asset} onEffect={this.onEffect} /> : null}
        <div onClick={onClose} style={{ position: "relative", height: "100%" }}>
          <PreviewImage asset={asset} preview={canvas} />
        </div>
      </section>
    );
  }
}

export default PreviewScreen;
