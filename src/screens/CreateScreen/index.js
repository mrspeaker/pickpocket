"use babel";

import React from "react";
import Footer from "../../ui/Footer";

const { Component, PropTypes } = React;

class CreateScreen extends Component {
  static propTypes = {
    assetPath: PropTypes.string.isRequired,
    onSetFXCanvas: PropTypes.func.isRequired
  };

  state = {
    w: 32,
    h: 32,
    isGrid: false,
    hasBorders: true,
    cols: 5,
    rows: 2,
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
      for (let j = 0; j < rows; j++) {
        for (let i = 0; i < cols; i++) {
          const hue = (Math.random() * 360) | 0;
          ctx.fillStyle = `hsl(${hue}, 30%, 50%)`;
          ctx.fillRect(i * w, j * h, w, h);
          if (hasBorders) {
            ctx.strokeStyle = `black`;
            ctx.strokeRect(i * w + 0.5, j * h + 0.5, w, h);
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
    return (
      <div className="screen">
        <div>!!! Under construction !!!</div>
        <section className="controls">
          <button
            title="rnd color"
            className="btn"
            onClick={() => this.create()}
            disabled={false}
          >
            rnd color
          </button>
          <div>
            <label>is grid</label>
            <input
              type="checkbox"
              onChange={() => this.onGrid()}
              checked={isGrid}
            />
            <label>Width:</label>
            <input
              type="number"
              style={{ width: "80px" }}
              onChange={e => this.onSize("w", e)}
              value={w}
            />
            <span style={{ display: "inline-block", width: 45 }} />
            <label>Height:</label>
            <input
              type="number"
              style={{ width: "80px" }}
              onChange={e => this.onSize("h", e)}
              value={h}
            />
            <span style={{ display: "inline-block", width: 45 }} />
          </div>
        </section>
        <section className="controls">
          <div>
            <label>borders</label>
            <input
              type="checkbox"
              onChange={() => this.onBorders()}
              checked={hasBorders}
            />

            <span style={{ display: "inline-block", width: 45 }} />
            <label>columns:</label>
            <input
              type="number"
              style={{ width: "80px" }}
              onChange={e => this.onSize("cols", e)}
              value={cols}
            />
            <span style={{ display: "inline-block", width: 45 }} />
            <label>rows:</label>
            <input
              type="number"
              style={{ width: "80px" }}
              onChange={e => this.onSize("rows", e)}
              value={rows}
            />
            <span style={{ display: "inline-block", width: 45 }} />
          </div>
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
