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
    fxCanvas: null,

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
    const {mode} = this.state;
    if (mode === "fx") {
      this.onImportCanvas(doOpen, projectRoot);
      return;
    }

    const {importPath, importName, assetPath, assetName} = this.state;

    copyFile(assetPath + assetName, projectRoot, importPath, importName)
      .then(res => this.onImportSuccess({ ...res, doOpen }))
      .catch(err => err && atom.notifications.addError(err));

    this.onClose();
  };

  onImportCanvas = (doOpen, projectRoot) => {

    const { importPath, importName, fxCanvas } = this.state;

    const imgData = fxCanvas.toDataURL("image/png");

    writeImage(imgData, projectRoot, importPath, importName)
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

  onSwitchMode = () => {
    const {mode} = this.state;
    if (mode === "pick") {
      this.setState({
        mode: "fx"
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

  onEscape = () => {
    const {mode, assetName} = this.state;
    if (mode === "pick") {
      if (assetName) {
        this.onSelectAssetFile();
      }
      else {
        this.onClose();
      }
    } else {
      this.setState({
        mode: "pick",
        assetName: ""
      });
    }
  }

  onClose = () => {
    this.setState({ mode: "pick" }, () => {
      this.props.toggle();
    });
  };

  onSetFXCanvas = ref => {
    this.setState({
      fxCanvas: ref
    });
  }

  render() {
    const { dirs, imgs, mode, importPath, importName, assetPath, assetName } = this.state;

    const screen = mode === "pick"
      ? <PickPocket
          assets={{ dirs, imgs }}
          assetName={assetName}
          assetPath={assetPath}
          onChangePath={this.onChangeAssetPath}
          onSelectFile={this.onSelectAssetFile}
        />
      : <EffectPocket
          onClose={this.onClose}
          onImport={this.onImportCanvas}
          onSwitchMode={this.switchMode}
          assetPath={assetPath}
          assetName={assetName}
          onSetFXCanvas={this.onSetFXCanvas}
        />;

    return <div className="pickpocket">
      <section>
        <Toolbar
          mode={mode}
          onClose={this.onClose}
          onOpenSettings={this.onOpenSettings}
          onOpenAssets={this.onOpenAssets}
          onSwitchMode={this.onSwitchMode}
          onImport={this.onImport}
          canImport={!!assetName}
        />
      </section>
      <section style={{ paddingTop: 4 }}>
        <MiniEditor
          text={`${importPath}${importName}`}
          onChange={this.changeImportPath}
          onEscape={this.onEscape}
          onEnter={this.onImport}
        />
      </section>

      {screen}

      <Footer />

    </div>;
  }
}

export default App;
