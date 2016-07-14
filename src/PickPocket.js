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
      path: "",
      doOpen: false
    };
  }

  toggleDoOpen = () => this.setState(({doOpen}) => ({doOpen:!doOpen}));

  isSelected = asset => this.state.selected.indexOf(asset) !== -1;

  updatePath = text => {
    const {path, fileName} = utils.splitPathAndFileName(text);
    this.setState({
      path,
      fileName
    });
  }

  onToggle = asset => {
    if (asset.type === "directory") {
      this.props.onChangePath(asset.fullPath + "/");
      return;
    }
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
    const {selected, path, fileName, doOpen} = this.state;
    this.props.onImport(
      selected[0],
      path,
      fileName,
      doOpen);
  }

  componentWillReceiveProps ({treePath}) {
    this.setState({
      path: treePath
    });
  }

  render () {
    const { assets, onClose } = this.props;
    const { path, fileName, selected, doOpen } = this.state;

    return <div className="pickpocket">
      <div id="tools">
        <button id="close" onClick={onClose}>close</button>
        <button id="choose" onClick={this.onImport}>import</button>
        <input type="checkbox" value={doOpen} onChange={this.toggleDoOpen} />
        <label htmlFor="doOpen">Open in editor</label>
      </div>
      <MiniEditor
        text={`${path}${fileName}`}
        onChange={this.updatePath} />
      <Assets
        assets={assets}
        selected={selected}
        onToggle={this.onToggle} />
    </div>;
  }

}

export default PickPocket;
