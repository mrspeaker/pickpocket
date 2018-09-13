"use babel";

import React from "react";
import Footer from "../../ui/Footer";
import Toolbar from "./Toolbar";
import MiniEditor from "../../ui/MiniEditor";

const { Component, PropTypes } = React;

class CreateScreen extends Component {
  static propTypes = {
    assetPath: PropTypes.string.isRequired,
    onSetFXCanvas: PropTypes.func.isRequired,
    onSwitchMode: PropTypes.func.isRequired
  };

  state = {
    w: 32,
    h: 32,
    isGrid: true,
    hasBorders: true,
    cols: 5,
    rows: 4,
    ctx: null,
    moused: false
  };

  componentDidMount() {
    this.props.onSetFXCanvas(this.refs.canvas);
    this.create();
  }

  create() {
    const canvas = this.refs.canvas;
    if (!canvas || !canvas.getContext) {
      return;
    }
    const { w, h, isGrid, hasBorders, rows, cols } = this.state;
    const width = w * (isGrid ? cols : 1);
    const height = h * (isGrid ? rows : 1);
    const ctx = canvas.getContext("2d");
    this.setState({ ctx });
    canvas.width = width;
    canvas.height = height;

    if (!isGrid) {
      ctx.fillStyle = `hsl(${(Math.random() * 360) | 0}, 50%, 50%)`;
      ctx.fillRect(0, 0, width, height);
    } else {
      ctx.lineWidth = 1;
      for (let j = 0; j < rows; j++) {
        for (let i = 0; i < cols; i++) {
          const hue = (Math.random() * 360) | 0;
          const sat = ((1 - Math.random() * Math.random()) * 100) | 0;
          const bri = (Math.random() * 100) | 0;
          ctx.fillStyle = `hsl(${hue}, ${sat}%, ${bri}%)`;
          ctx.fillRect(i * w, j * h, w, h);
          if (hasBorders) {
            ctx.strokeStyle = "#000";
            ctx.strokeRect(i * w - 0.5, j * h - 0.5, w, h);
          }
        }
      }
    }
  }

  onSize = (dim, e) => {
    this.setState(
      {
        [dim]: parseInt(e.target.value)
      },
      () => this.create()
    );
  };

  onGrid = () => {
    this.setState({ isGrid: !this.state.isGrid }, () => this.create());
  };

  onBorders = () => {
    this.setState({ hasBorders: !this.state.hasBorders }, () => this.create());
  };

  clicked = (e, force) => {
    const { ctx, moused } = this.state;
    if (!moused && !force) {
      return;
    }
    ctx.fillStyle = "rgba(0, 0, 0, 0.8)";
    const offset = ctx.canvas.getBoundingClientRect();
    ctx.fillRect(e.pageX - offset.left - 2, e.pageY - offset.top - 2, 4, 4);
    ctx.canvas.style.cursor = "none";
  };

  moused = down => {
    this.setState({
      moused: down
    });
    if (!down) this.state.ctx.canvas.style.cursor = "crosshair";
  };

  render() {
    const { w, h, isGrid, hasBorders, cols, rows } = this.state;
    const { onSwitchMode, onImport } = this.props;
    const fileName = "boop.png";
    return (
      <div className="screen">
        <section className="controls block">
          <div className="block">
            <label>width:</label>
            <input
              type="number"
              className="input-number short-text"
              onChange={e => this.onSize("w", e)}
              value={w}
            />
            <label>height:</label>
            <input
              type="number"
              className="input-number short-text"
              onChange={e => this.onSize("h", e)}
              value={h}
            />
          </div>

          <div className="block">
            <label>columns:</label>
            <input
              type="number"
              className="input-number short-text"
              onChange={e => this.onSize("cols", e)}
              value={cols}
            />
            <label>rows:</label>
            <input
              type="number"
              className="input-number short-text"
              onChange={e => this.onSize("rows", e)}
              value={rows}
            />
          </div>

          <div className="block">
            <label>sprite sheet:</label>
            <input
              type="checkbox"
              className="input-checkbox"
              onChange={() => this.onGrid()}
              checked={isGrid}
            />
            <label>borders:</label>
            <input
              type="checkbox"
              className="input-checkbox"
              onChange={() => this.onBorders()}
              checked={hasBorders}
            />
          </div>
          <div className="block">
            <button
              title="rnd color"
              className="btn"
              onClick={() => this.create()}
              disabled={false}
            >
              rnd color
            </button>
          </div>
        </section>
        <section>
          <Toolbar
            onBack={onSwitchMode}
            onImport={doOpen => onImport(fileName, doOpen)}
          />
        </section>
        <section className="textContainer">
          <MiniEditor
            text={fileName}
            range={fileName.endsWith(".png") ? [0, fileName.length - 4] : null}
            onChange={() => {}}
            onEscape={() => {}}
            onEnter={() => {}}
          />
        </section>
        <section>
          <div
            style={{ textAlign: "center", paddingTop: 20, paddingBottom: 20 }}
          >
            <canvas
              ref="canvas"
              onMouseDown={e => {
                this.moused(true);
                this.clicked(e, true);
              }}
              onMouseMove={this.clicked}
              onMouseUp={() => this.moused(false)}
              onMouseLeave={() => this.moused(false)}
              style={{
                verticalAlign: "middle",
                maxWidth: "80%",
                cursor: "crosshair"
              }}
            />
          </div>
        </section>

        <Footer />
      </div>
    );
  }
}

export default CreateScreen;
