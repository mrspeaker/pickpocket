"use babel";

import React from "react";
import Assets from "./Assets";
import MiniEditor from "./ui/MiniEditor";
import utils from "./utils";

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
      fileName: "",
      path: ""
    };
  }

  isSelected = asset => this.state.selected.indexOf(asset) !== -1;

  updatePath = text => {
    const {path, fileName} = utils.splitPathAndFileName(text);
    this.setState({
      path,
      fileName
    });
  }

  onToggle = asset => {
    if (this.isSelected(asset)) {
      this.setState(() => ({
        fileName: "",
        selected: [] // selected.filter(a => a!== asset)
      }));
      return;
    }
    this.setState(() => ({
      fileName: utils.splitPathAndFileName(asset.fullPath).fileName,
      selected: [asset] // [...selected, asset]
    }));
  };

  onImport = () => {
    const {selected, path, fileName} = this.state;
    this.props.onImport(
      selected[0],
      fileName,
      path);
  }

  componentWillReceiveProps ({treePath}) {
    console.log("tp!", treePath);
    //this.editor.setText(text);
    this.setState({
      path: treePath
    });
  }

  render () {
    const { assets, onClose, treePath } = this.props;
    const { path, fileName, selected } = this.state;

    return <div className="pickpocket">
      <div id="tools">
        <button id="close" onClick={onClose}>close</button>
        <button id="choose" onClick={this.onImport}>import</button>
        <input type="checkbox" id="doOpen" />
        <label htmlFor="doOpen">Open in editor</label>
      </div>
      <MiniEditor
        text={`${path}${fileName}`}
        onChange={this.updatePath} />
      <Assets
        assets={assets.imgs}
        selected={selected}
        onToggle={this.onToggle} />
    </div>;
  }

}

export default PickPocket;
