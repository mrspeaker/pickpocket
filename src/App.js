"use babel";
/* global atom */

import React from "react";
import proc from "child_process";
const { exec } = proc;

import PickScreen from "./screens/PickScreen";
import CreateScreen from "./screens/CreateScreen";

import fetchImagesFromFolder from "./file/fetchImagesFromFolder";
import fetchAllImages from "./file/fetchAllImages";
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

    // TODO: not sure this is needed in state anymore.
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

    this.fetchProjectImages();

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

  onImport = (asset, saveName, doOpenOrEvent) => {
    const { pickFromAssets } = this.state;
    if (!pickFromAssets) {
      // // TODO: ::: doOpenOrEvent
      this.openEditor(asset.fullPath);
      return;
    }

    const doOpen = doOpenOrEvent === true;
    const projectRoot = getProjectRoot();
    if (!projectRoot) {
      return;// this.props.toggle();
    }

    const importPath = getTreeFile().path;
    const { fullPath, name } = asset;

    copyFile(fullPath, projectRoot, importPath, saveName || name)
      .then(res => this.onImportSuccess({ ...res, doOpen }))
      .catch(err => err && atom.notifications.addError(err));
  };

  onImportCanvas = (assetName, doOpen) => {
    const { fxCanvas } = this.state;

    if (!fxCanvas) return;
    const importPath = getTreeFile().path;
    const imgData = fxCanvas.toDataURL("image/png");

    const projectRoot = getProjectRoot();
    if (!projectRoot) return;

    writeImage(imgData, projectRoot, importPath, assetName)
      .then(res => this.onImportSuccess({ ...res, doOpen }))
      .catch(err => err && atom.notifications.addError(err));
  };

  onImportCanvas2 = (imgData, saveName, doOpen) => {
    const importPath = getTreeFile().path;
    const projectRoot = getProjectRoot();
    if (!projectRoot) return;

    writeImage(imgData, projectRoot, importPath, saveName)
      .then(res => this.onImportSuccess({ ...res, doOpen }))
      .catch(err => err && atom.notifications.addError(err));
  }

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
    this.fetchProjectImages();
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

  fetchProjectImages() {
    // TODO: should only be done sync? On toggle?
    fetchAllImages().then(({ imgs }) => {
      this.setState({ projImgs: imgs });
    });
  }

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

  onOpenSettings = () => {
    atom.workspace.open("atom://config/packages/pickpocket");
  };

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

    const isProject = mode === "pick" && !pickFromAssets;
    const isAssets = mode === "pick" && !isProject;
    const isGenerate = mode === "create";

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
            pickFromAssets={pickFromAssets}
            onOpenAssets={this.onOpenAssets}
            onChangePath={this.onChangeAssetPath}
            onSelectFile={this.onSelectAssetFile}
            onImport={this.onImport}
            onImportCanvas={this.onImportCanvas2}
            onNew={this.onNew}
            onToggleSource={this.onToggleSource}
          />
        );
        break;
      case "create":
        screen = (
          <CreateScreen
            onSetFXCanvas={this.onSetFXCanvas}
            onSwitchMode={this.onSwitchMode}
            onImport={this.onImportCanvas}
          />
        );
        break;
    }

    return (
      <div className="pickpocket">
        <div className="btn-toolbar toolbar">
          <div class="btn-group">
            <button
              title="generate new asset"
              className={`btn icon icon-file-media ${isProject ? "selected": ""}`}
              onClick={() => {
                this.setState({
                  pickFromAssets: false,
                  mode: "pick"
                });
              }}
            >
              project
            </button>
            <button
              title="generate new asset"
              className={`btn icon icon-package ${isAssets ? "selected": ""}`}
              onClick={() => {
                this.setState({
                  pickFromAssets: true,
                  mode: "pick"
                });
              }}
            >
              pocket
            </button>
            <button
              title="generate new asset"
              className={`btn icon icon-pulse ${isGenerate ? "selected": ""}`}
              onClick={() => {
                this.setState({
                  mode: "create"
                });
              }}
            >
              generate
            </button>
            <button
              style={{float:"right"}}
              className="btn icon icon-gear"
              onClick={this.onOpenSettings}
              title="go to pickpocket settings"
            />
          </div>
        </div>
        {screen}
        <Footer />
      </div>
    );
  }
}

export default App;
