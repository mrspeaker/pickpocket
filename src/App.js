"use babel";
/* global atom */

import React from "react";
import proc from "child_process";
const { exec } = proc;

import PickPocket from "./PickPocket";
import EffectPocket from "./EffectPocket";

import fetchImagesFromFolder from "./file/fetchImagesFromFolder";
import copyFile from "./file/copyFile";
import writeImage from "./file/writeImage";
import getTreePath from "./file/getTreePath";
import getProjectRoot from "./file/getProjectRoot";
import getAssetRoot from "./file/getAssetRoot";
import utils from "./utils";

import Toolbar from "./Toolbar";
import MiniEditor from "./ui/MiniEditor";
import Footer from "./ui/Footer";

const {
  Component,
  PropTypes
} = React;

class App extends Component {
  static propTypes = {
    toggle: PropTypes.func.isRequired
  };

  state = {
    dirs: [],
    imgs: [],
    mode: "pick",
    selectedAsset: null,

    importPath: getTreePath(),
    importName: "",
    assetPath: getAssetRoot(),
    assetName: ""
  };

  componentDidMount() {
    fetchImagesFromFolder(getAssetRoot())
      .then(({ dirs, imgs }) => {
        this.setState({
          dirs,
          imgs
        });
      })
      .catch(() => {
        atom.notifications.addError(
          "Please set asset folder set in preferences"
        );
        atom.notifications.addError(this.getAssetRoot());
        this.props.toggle();
      });
  }

  changeImportPath = text => {
    const { path, fileName } = utils.splitPathAndFileName(text);
    this.setState({
      importPath: path,
      importName: fileName
    });
  };

  onOpenAssets = () => {
    exec(`open ${getAssetRoot()}`);
  };

  onOpenSettings = () => {
    atom.workspace.open("atom://config/packages/pickpocket");
    this.onClose();
  };

  onImport = (doOpenOrEvent) => {
    const doOpen = doOpenOrEvent === true;

    const projectRoot = getProjectRoot();
    if (!projectRoot) {
      return this.props.toggle();
    }
    const {importPath, importName, assetPath, assetName} = this.state;

    copyFile(assetPath + assetName, projectRoot, importPath, importName)
      .then(res => this.onImportSuccess({ ...res, doOpen }))
      .catch(err => err && atom.notifications.addError(err));

    this.onClose();
  };

  onImportCanvas = canvas => {
    const projectRoot = getProjectRoot();
    if (!projectRoot) {
      return this.props.toggle();
    }

    const { importPath, importFileName } = this.state;
    const imgData = canvas.toDataURL("image/png");

    writeImage(imgData, projectRoot, importPath, importFileName)
      .then(this.onImportSuccess)
      .catch(err => err && atom.notifications.addError(err));

    this.onClose();
  };

  onImportSuccess(
    { localPathAndName, localFullPath, fileName, path, doOpen = false }
  ) {
    atom.clipboard.write(`"${localPathAndName}"`);
    atom.notifications.addSuccess(`Copied ${fileName} to ${path}`);
    doOpen && this.openEditor(localFullPath);
  }

  onSwitchMode = (selectedAsset) => {
    if (selectedAsset) {
      this.setState({
        mode: "fx",
        selectedAsset
      });
    } else {
      this.setState({
        mode: "pick"
      }, () => {
        // Forces mini-editor update
        this.forceUpdate();
      });
    }
  };

  onChangeAssetPath = newPath => fetchImagesFromFolder(newPath).then(res => {
    const {path} = utils.splitPathAndFileName(newPath);
    if (newPath !== getAssetRoot()) {
      res.dirs.splice(0, 0, {
        type: "directory",
        size: 0,
        fullPath: utils.parentPath(newPath),
        name: ".."
      });
    }
    this.setState({
      dirs: res.dirs,
      imgs: res.imgs,
      assetPath: path,
    });
  });

  onSelectAssetFile = (path, fileName="") => {
    this.setState({
      importName: fileName,
      assetName: fileName
    });
  }

  openEditor(fullPath) {
    const ed = atom.config.get("pickpocket.imageEditorAppName");
    if (ed) {
      exec(`open -a ${ed} ${fullPath}`);
    }
  }

  onClose = () => {
    this.setState({ mode: "pick" });
    this.props.toggle();
  };

  render() {
    const { dirs, imgs, mode, selectedAsset, importPath, importName } = this.state;

    const screen = mode === "pick"
      ? <PickPocket
          assets={{ dirs, imgs }}
          onChangePath={this.onChangeAssetPath}
          onSelectFile={this.onSelectAssetFile}
        />
      : <EffectPocket
          onClose={this.onClose}
          onImport={this.onImportCanvas}
          onSwitchMode={this.switchMode}
          asset={selectedAsset}
        />;

    return <div>
      <section>
        <Toolbar
          onClose={this.onClose}
          onOpenSettings={this.onOpenSettings}
          onOpenAssets={this.onOpenAssets}
          onSwitchMode={this.onSwitchMode}
          onImport={this.onImport}
        />
      </section>
      <section style={{ paddingTop: 4 }}>
        <MiniEditor
          text={`${importPath}${importName}`}
          onChange={this.changeImportPath}
          onEscape={this.onClose}
          onEnter={this.onImport}
        />
      </section>

      {screen}

      <Footer />

    </div>;
  }
}

export default App;
