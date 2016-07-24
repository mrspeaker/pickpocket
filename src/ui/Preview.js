"use babel";

import React from "react";
import utils from "../utils";

const {
  Component
} = React;

class Preview extends Component {

  state = {
    width: -1,
    height: -1
  };

  componentDidMount () {
    const image = new Image();
    image.src = this.props.asset.fullPath;
    image.onload = () => {
      const {width, height} = image;

      this.setState({
        width,
        height
      });
    };
  }

  render () {
    const {asset, onClose} = this.props;
    const {width, height} = this.state;
    const {fullPath, size} = asset;
    return <div className="preview" onClick={onClose} style={{
      backgroundImage: `url("${fullPath}")`,
      backgroundSize: "contain",
      backgroundRepeat: "no-repeat",
      backgroundPosition: "center"
    }}>
      <div style={{
        position: "absolute",
        bottom: 0,
        left: 0,
        backgroundColor: "rgba(0, 0, 0, 0.7)",
        color: "#888",
        padding: 4,
        width: 80
      }}>
        &nbsp;{`${width} x ${height}`},
        &nbsp;{ utils.toKb(size) }
      </div>
    </div>;
  }
}

export default Preview;
