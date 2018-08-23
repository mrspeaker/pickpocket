"use babel";

import React from "react";
import utils from "../../utils";

import Toolbar from "./Toolbar";
import MiniEditor from "../../ui/MiniEditor";
import PreviewImage from "../../ui/PreviewImage";

const { Component, PropTypes } = React;

const styles = {
  screen: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    display: "flex",
    flexDirection: "column"
  }
};

class PreviewScreen extends Component {
  static propTypes = {
    asset: PropTypes.object.isRequired,
    onClose: PropTypes.func.isRequired
  };

  state = {
    fileName: null
  };

  onChangeFileName = text => {
    this.setState({
      fileName: text
    });
  };

  onImport = doEdit => {
    const { asset: name } = this.props;
    const { fileName } = this.state;
    this.props.onImport(fileName || name, doEdit);
  };

  render() {
    const { asset, onClose } = this.props;
    const fileName = this.state.fileName || asset.name;
    return (
      <section style={styles.screen} id="fooop">
        <Toolbar mode={"pick"} onImport={this.onImport} />
        <section className="textContainer">
          <MiniEditor
            text={fileName}
            range={fileName === asset.name ? [0, fileName.length - 4] : null}
            onChange={this.onChangeFileName}
            onEscape={onClose}
            onEnter={() => {}}
          />
        </section>
        <div onClick={onClose} style={{ position: "relative", height: "100%" }}>
          <PreviewImage asset={asset} />
        </div>
      </section>
    );
  }
}

export default PreviewScreen;
