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
    onOpenAssets: PropTypes.func.isRequired,
    treePath: PropTypes.string
  };

  constructor () {
    super();
    this.state = {
      selected: [],
      preview: null,
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

  closePreview = () => {
    this.setState({
      preview: null
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
      preview: asset,
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
    const { assets, onClose, onOpenAssets } = this.props;
    const { path, fileName, selected, doOpen, preview } = this.state;

    return <div className="pickpocket">
      <section className="input-block find-container">
        <div className="btn-group">
          <button className="btn" onClick={onClose}>close</button>
          &nbsp;
          <button className="btn" onClick={onOpenAssets}>Open Assets</button>
          &nbsp;
          <button className="btn" onClick={this.onImport}>import</button>
          <label htmlFor="doOpen">
            <input type="checkbox" value={doOpen} onChange={this.toggleDoOpen} />
            <div className="options" style={{display:"inline-block"}}>Open in editor</div>
          </label>
          <div className="icon icon-diff-modified" style={{display:"inline-block",float:"right"}}></div>
        </div>
      </section>
      <section>
        <MiniEditor
          text={`${path}${fileName}`}
          onChange={this.updatePath} />
      </section>
      <section>
        <Assets
          assets={assets}
          selected={selected}
          onToggle={this.onToggle}
          onPreview={this.onPreview} />
        { preview && <div className="preview" onClick={this.closePreview}>
          <div><img src={preview.fullPath} width={300} height={300} /></div>
        </div> }
      </section>
      <footer className="header">
        <span className="header-item description">
          <span className="subtle-info-message">Close this panel with the
            <span className="highlight">esc</span> key
          </span>
        </span>
        <span className="header-item options-label pull-right">
          <span>Options: </span>
          <span className="options">{"don't open editor"}</span>
        </span>
      </footer>
    </div>;
  }

}

export default PickPocket;
