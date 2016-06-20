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
      selected: [],
    };
  }

  isSelected = asset => this.state.selected.indexOf(asset) !== -1;

  onToggle = asset => {
    if (this.isSelected(asset)) {
      this.setState(({selected}) => ({
        selected: []// selected.filter(a => a!== asset)
      }));
      return;
    }
    this.setState(({selected}) => ({
      selected: [asset]// [...selected, asset]
    }));
  };

  onImport = asset => {
    // Copy to current proj dir.
    //onChoosed ( localPath, assetName, doOpen ) {
/*    const projectRoot = atom.project.getDirectories()[ 0 ].path;
    const assetRoot = this.getAssetRoot();
    const assetFullPath = assetRoot + assetName;
    const localFullPath = `${ projectRoot }/${ localPath }`;

    // TODO: use fs-extras copy, and error check
    fs.writeFileSync( localFullPath, fs.readFileSync( assetFullPath ) );

    atom.clipboard.write( `"${ localPath }"` );
    atom.notifications.addSuccess(`Copied ${ assetName } to ${ localPath }`);
    doOpen && this.openEditor( localFullPath );*/
  }

  render () {
    const { assets, onClose, onImport, dir } = this.props;
    const { selected } = this.state;

    return <div className="pickpocket">
      <div id="tools">
        <button id="close" onClick={onClose}>close</button>
        <button id="choose" onClick={onImport}>import</button>
        <input type="checkbox" id="doOpen" />
        <label htmlFor="doOpen">Open in editor</label>
      </div>
      <MiniEditor text={dir} selected={selected.length ? selected[0] : null} />
      <Assets
        assets={assets.imgs}
        selected={selected}
        onToggle={this.onToggle} />
    </div>;
  }

}

export default PickPocket;
