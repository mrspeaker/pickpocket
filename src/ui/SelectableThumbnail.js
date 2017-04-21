"use babel";

import React from "react";

const {
  Component,
  PropTypes,
} = React;

class SelectableThumbnail extends Component {

  static propTypes = {
    src: PropTypes.string.isRequired,
    selected: PropTypes.bool.isRequired,
    onToggle: PropTypes.func.isRequired,
  };

  state = {
    width: -1,
    height: -1
  };

  componentDidMount () {
    this.refs.img.onload = () => {
      this.refs.img && this.setState({
        width: this.refs.img.naturalWidth,
        height: this.refs.img.naturalHeight
      });
    };
  }

  render () {
    const { src, selected, onToggle } = this.props;
    const { width, height } = this.state;

    return <div onClick={onToggle} className={`thumb ${selected ? "selected" :  ""}`}>
      <img ref={"img"} src={src} title={ src.split("/").reverse()[0] } />
      <div className="meta">{ width } x { height }</div>
    </div>;

  }

}

export default SelectableThumbnail;
