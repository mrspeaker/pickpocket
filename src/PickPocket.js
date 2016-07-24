"use babel";

import React from "react";
import Assets from "./Assets";
import MiniEditor from "./ui/MiniEditor";
import utils from "./utils";
import Preview from "./ui/Preview";
import Footer from "./ui/Footer";

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
      canImport: false
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

  closePreview = (e) => {
    if (this.state.preview) {
      e.stopPropagation();
      this.setState({
        preview: null
      });
    }
  }

  onToggle = asset => {
    if (asset.type === "directory") {
      this.props.onChangePath(asset.fullPath + "/");
      return;
    }
    if (this.isSelected(asset)) {
      this.setState(() => ({
        fileName: "",
        selected: [],
        canImport: false
      }));
      return;
    }
    this.setState(() => ({
      fileName: utils.splitPathAndFileName(asset.fullPath).fileName,
      preview: asset,
      selected: [asset],
      canImport: true
    }));
  };

  onImport = (edit = false) => {
    const {selected, path, fileName} = this.state;
    this.props.onImport(
      selected[0],
      path,
      fileName,
      edit === true);
  }

  onImport

  componentWillReceiveProps ({treePath}) {
    this.setState({
      path: treePath
    });
  }

  render () {
    const { assets, onClose, onOpenAssets } = this.props;
    const { path, fileName, selected, preview, canImport } = this.state;

    return <div className="pickpocket">
      <section className="input-block find-container">
        <div className="btn-group" style={{width:"100%"}}>
          <button className="btn" onClick={this.onImport} disabled={!canImport}>import</button>
          <button className="btn" onClick={() => this.onImport(true)} disabled={!canImport}>import & edit</button>
          <button className="btn" onClick={onOpenAssets}>Open asset folder</button>
          <div className="icon icon-x" onClick={onClose} style={{
            cursor:"pointer",display:"inline-block",float:"right"}
          }></div>
        </div>
      </section>
      <section style={{paddingTop:4}}>
        <MiniEditor
          text={`${path}${fileName}`}
          onChange={this.updatePath}
          onEscape={this.closePreview}
          onEnter={this.onImport} />
      </section>
      <section>
        <Assets
          assets={assets}
          selected={selected}
          onToggle={this.onToggle}
          onPreview={this.onPreview} />
        { preview &&
          <Preview asset={preview} onClose={this.closePreview} />
        }
      </section>
      <Footer />
    </div>;
  }

}

export default PickPocket;
