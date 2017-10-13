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
    cols: 5,
    rows: 2
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
    const { w, h, isGrid, rows, cols } = this.state;
    const width = w * (isGrid ? cols : 1);
    const height = h * (isGrid ? rows : 1);
    const ctx = canvas.getContext("2d");
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
          ctx.strokeStyle = `rgb(30,30,30)`;
          ctx.strokeRect(i * w, j * h, w, h);
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

  render() {
    const { w, h, isGrid, cols, rows } = this.state;
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
            <label> </label>
            <label> </label>
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
            <label>is grid</label>
            <input
              type="checkbox"
              onChange={() => this.onGrid()}
              checked={isGrid}
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
              style={{
                verticalAlign: "middle",
                paddingLeft: 20,
                maxWidth: "80%"
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
