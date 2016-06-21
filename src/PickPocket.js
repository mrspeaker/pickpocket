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
    assets: PropTypes.array.isRequired,
    onImport: PropTypes.func.isRequired,
    onClose: PropTypes.func.isRequired,
    treePath: PropTypes.string
  };

  constructor () {
    super();
    this.state = {
      selected: [],
      path: ""
    };
  }

  isSelected = asset => this.state.selected.indexOf(asset) !== -1;

  updatePath = path => {
    console.log("pathz")
    if (path !== this.state.path) {
      this.setState({
        path
      });
    }
  }

  onToggle = asset => {
    if (this.isSelected(asset)) {
      this.setState(({selected}) => ({
        selected: [] // selected.filter(a => a!== asset)
      }));
      return;
    }
    this.setState(({selected}) => ({
      selected: [asset]// [...selected, asset]
    }));
  };

  onImport = () => {
    this.props.onImport(
      this.state.selected[0],
      this.state.path);
  }

  render () {
    const { assets, onClose, onImport, treePath } = this.props;
    const { selected } = this.state;

    return <div className="pickpocket">
      <div id="tools">
        <button id="close" onClick={onClose}>close</button>
        <button id="choose" onClick={this.onImport}>import</button>
        <input type="checkbox" id="doOpen" />
        <label htmlFor="doOpen">Open in editor</label>
      </div>
      <MiniEditor
        text={treePath}
        selected={selected.length ? selected[0] : null}
        onChange={this.updatePath} />
      <Assets
        assets={assets.imgs}
        selected={selected}
        onToggle={this.onToggle} />
    </div>;
  }

}

export default PickPocket;
