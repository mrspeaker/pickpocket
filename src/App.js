"use babel";
/* global atom */

import React from "react";
import proc from "child_process";
const { exec } = proc;

import PickScreen from "./screens/PickScreen";
import EffectScreen from "./screens/EffectScreen";
import CreateScreen from "./screens/CreateScreen";

import fetchImagesFromFolder from "./file/fetchImagesFromFolder";
import copyFile from "./file/copyFile";
import writeImage from "./file/writeImage";
import getTreeFile from "./file/getTreeFile";
import getProjectRoot from "./file/getProjectRoot";
import getAssetRoot from "./file/getAssetRoot";
import utils from "./utils";

import Footer from "./ui/Footer";

const { Component, PropTypes } = React;

class App extends Component {
  static propTypes = {
    toggle: PropTypes.func.isRequired
  };

  state = {
    dirs: [],
    imgs: [],
    mode: "pick",
    pickFromAssets: true,

    fxCanvas: null,

    projDirs: [],
    projImgs: [],

    currentFile: getTreeFile().file,
    importName: "",
    assetPath: getAssetRoot(),
    assetName: ""
  };

  componentDidMount() {
    // TODO: remove/fix this
    const f = this.state.currentFile;
    if (f && f.name.endsWith(".png")) {
      this.setState({
        mode: "img"
      });
    }

    // WIP: testing showing local images.
    const dirs = atom.project.getDirectories();
    dirs[0].getEntries((err, entries) => {
      entries.forEach(f => {
        if (f.isSymbolicLink()) return;
        if (f.getBaseName() === "res") {
          fetchImagesFromFolder(f.getPath() + "/")
            .then(({ dirs, imgs }) => {
              this.setState({
                projDirs: dirs,
                projImgs: imgs
              });
            })
            .catch(console.error);
        }
      });
    });

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
    const { fileName } = utils.splitPathAndFileName(text);
    this.setState({
      importName: fileName
    });
  };

  onOpenAssets = () => {
    const path = this.state.assetPath;
    switch (process.platform) {
      case "darwin":
        exec(`open ${path}`);
        break;
      case "linux":
        exec(`xdg-open ${path}`);
        break;
      default:
        console.warn("Open not implemented for ", process.platform);
    }
  };

  onImport = (name, doOpenOrEvent) => {
    const doOpen = doOpenOrEvent === true;
    const projectRoot = getProjectRoot();
    if (!projectRoot) {
      return this.props.toggle();
    }
    const { mode } = this.state;
    if (mode === "fx" || mode === "create") {
      this.onImportCanvas(doOpen, projectRoot);
      return;
    }
    const importPath = getTreeFile().path;
    // TODO: importName should be redundant now
    const { importName, assetPath, assetName } = this.state;

    copyFile(assetPath + assetName, projectRoot, importPath, name || importName)
      .then(res => this.onImportSuccess({ ...res, doOpen }))
      .catch(err => err && atom.notifications.addError(err));

    this.onClose();
  };

  onImportCanvas = (doOpen, projectRoot) => {
    const { importName, fxCanvas } = this.state;
    if (!fxCanvas) return;
    const importPath = getTreeFile().path;
    const imgData = fxCanvas.toDataURL("image/png");

    writeImage(imgData, projectRoot, importPath, importName)
      .then(res => this.onImportSuccess({ ...res, doOpen }))
      .catch(err => err && atom.notifications.addError(err));

    this.onClose();
  };

  onImportSuccess({
    localPathAndName,
    localFullPath,
    fileName,
    path,
    doOpen = false
  }) {
    atom.clipboard.write(`"${localPathAndName}"`);
    atom.notifications.addSuccess(`Copied ${fileName} to ${path}`);
    doOpen && this.openEditor(localFullPath);
  }

  onSwitchMode = () => {
    const { mode } = this.state;
    if (mode === "pick") {
      this.setState({
        mode: "fx"
      });
    } else {
      this.setState(
        {
          mode: "pick",
          // Eh, easiest way to reconsile lost selection in PickScreen. FIXME!
          assetName: "",
          importName: ""
        },
        () => {
          // Forces mini-editor update
          this.forceUpdate();
        }
      );
    }
  };

  onNew = () => {
    this.setState({
      mode: "create",
      assetName: "",
      importName: "untitled.png"
    });
  };

  onChangeAssetPath = newPath =>
    fetchImagesFromFolder(newPath).then(res => {
      const { pickFromAssets } = this.state;
      const { path } = utils.splitPathAndFileName(newPath);
      if (newPath !== getAssetRoot()) {
        res.dirs.splice(0, 0, {
          type: "directory",
          size: 0,
          fullPath: utils.parentPath(newPath),
          name: ".."
        });
      }
      this.setState({
        [pickFromAssets ? "dirs" : "projDirs"]: res.dirs,
        [pickFromAssets ? "imgs" : "projImgs"]: res.imgs,
        assetPath: path
      });
    });

  onSelectAssetFile = (path, fileName = "") => {
    this.setState({
      importName: fileName,
      assetName: fileName
    });
  };

  openEditor(fullPath) {
    const ed = atom.config.get("pickpocket.imageEditorAppName");
    if (ed) {
      switch (process.platform) {
        case "darwin":
          exec(`open -a ${ed} ${fullPath}`);
          break;
        default:
          exec(`${ed} ${fullPath}`);
          break;
      }
    }
  }

  onEscape = () => {
    const { mode, assetName } = this.state;
    if (mode === "pick") {
      if (assetName) {
        this.onSelectAssetFile();
      } else {
        this.onClose();
      }
    } else {
      this.setState({
        mode: "pick",
        assetName: "",
        importName: ""
      });
    }
  };

  onClose = () => {
    this.setState({ mode: "pick" }, () => {
      this.props.toggle();
    });
  };

  onSetFXCanvas = ref => {
    this.setState({
      fxCanvas: ref
    });
  };

  onToggleSource = () => {
    this.setState(({ pickFromAssets }) => ({
      pickFromAssets: !pickFromAssets
    }));
  };

  render() {
    const {
      dirs,
      imgs,
      mode,
      pickFromAssets,
      projDirs,
      projImgs,
      assetPath,
      assetName
    } = this.state;

    const curDirs = pickFromAssets ? dirs : projDirs;
    const curImgs = pickFromAssets ? imgs : projImgs;

    let screen;
    switch (mode) {
      case "img":
        screen = (
          <div>
            <div>{this.state.currentFile.path}</div>
            <img src={this.state.currentFile.path} />
            <div>{"... under construction ..."}</div>
          </div>
        );
        break;
      case "pick":
        screen = (
          <PickScreen
            assets={{ dirs: curDirs, imgs: curImgs }}
            assetName={assetName}
            assetPath={assetPath}
            onOpenAssets={this.onOpenAssets}
            onClose={this.onClose}
            onChangePath={this.onChangeAssetPath}
            onSelectFile={this.onSelectAssetFile}
            onImport={this.onImport}
            onNew={this.onNew}
            onToggleSource={this.onToggleSource}
          />
        );
        break;
      case "fx":
        screen = (
          <EffectScreen
            assetPath={assetPath}
            assetName={assetName}
            onSetFXCanvas={this.onSetFXCanvas}
          />
        );
        break;
      case "create":
        screen = (
          <CreateScreen
            onSetFXCanvas={this.onSetFXCanvas}
            onSwitchMode={this.onSwitchMode}
          />
        );
        break;
    }

    return (
      <div className="pickpocket">
        {screen}
        <Footer />
      </div>
    );
  }
}

export default App;
