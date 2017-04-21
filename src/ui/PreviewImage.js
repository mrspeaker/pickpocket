"use babel";

import React from "react";
import utils from "../utils";

const { Component, PropTypes } = React;

const styles = {
  container: {
    backgroundSize: "contain",
    backgroundRepeat: "no-repeat",
    backgroundPosition: "center"
  },
  meta: {
    position: "absolute",
    bottom: 0,
    left: 0,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    color: "#888",
    padding: 4,
    width: 120
  }
};

class PreviewImage extends Component {
  static propTypes = {
    asset: PropTypes.object.isRequired,
    onClose: PropTypes.func.isRequired
  };

  state = {
    width: -1,
    height: -1
  };

  componentDidMount() {
    const image = new Image();
    image.src = this.props.asset.fullPath;
    image.onload = () => {
      const { width, height } = image;

      this.setState({
        width,
        height
      });
    };
  }

  render() {
    const { asset, onClose } = this.props;
    const { width, height } = this.state;
    const { fullPath, size } = asset;
    const style = Object.assign({}, styles.container, {
      backgroundImage: `url("${fullPath}")`
    });

    return (
      <div className="preview" onClick={onClose} style={style}>
        <div style={styles.meta}>
          {`${width} x ${height}`}, {utils.toKb(size)}
        </div>
      </div>
    );
  }
}

export default PreviewImage;
