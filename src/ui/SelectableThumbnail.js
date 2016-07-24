"use babel";

import React from "react";

const {
  Component,
} = React;

class SelectableThumbnail extends Component {

  state = {
    width: -1,
    height: -1
  };

  componentDidMount () {
    this.refs.img.onload = () => {
      this.setState({
        width: this.refs.img.naturalWidth,
        height: this.refs.img.naturalHeight
      });
    };
  }

  render () {
    const { asset, selected, onToggle } = this.props;
    const { width, height } = this.state;
    const { fullPath } = asset;

    return <div onClick={onToggle} className={`thumb ${selected ? "selected" :  ""}`}>
      <img ref={"img"} src={fullPath} />
      <div className="meta">{ width } x { height }</div>
    </div>;

  }

}

export default SelectableThumbnail;
