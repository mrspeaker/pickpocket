"use babel";

import React from "react";
import Assets from "./Assets";
import MiniEditor from "./ui/MiniEditor";

const {
  Component,
  PropTypes
} = React;

class PickPocket extends Component {

  static propTypes = {
    assets: PropTypes.array.isRequired
  };

  constructor () {
    super();
    this.state = {
      selected: []
    };
  }

  render () {
    const { assets } = this.props;

    return <div className="pickpocket">
      <div id="tools">
        <button id="close">close</button>
        <button id="choose">import</button>
        <input type="checkbox" id="doOpen" />
        <label htmlFor="doOpen">Open in editor</label>
      </div>
      <MiniEditor />
      <Assets assets={assets.imgs} />
    </div>;
  }

}

export default PickPocket;
