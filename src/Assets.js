"use babel";

import React from "react";
import SelectableThumbnail from "./ui/SelectableThumbnail";

const {
  Component,
  PropTypes
} = React;

class Assets extends Component {

  static propTypes = {
    assets: PropTypes.array.isRequired
  };

  render () {
    const { assets } = this.props;

    return <div className="thumbs">{
      assets.map(({fullPath}) =>
        <SelectableThumbnail
          src={fullPath}
          selected={false}
        />
      )
    }</div>;

  }

}

export default Assets;
