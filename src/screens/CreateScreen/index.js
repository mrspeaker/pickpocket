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
    h: 32
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
    const { w, h } = this.state;

    const ctx = canvas.getContext("2d");
    canvas.width = w;
    canvas.height = h;

    ctx.fillStyle = `hsl(${(Math.random() * 360) | 0}, 50%, 50%)`;
    ctx.fillRect(0, 0, w, h);
  }

  onSize = (dim, e) => {
    this.setState({
      [dim]: parseInt(e.target.value)
    });
  };

  render() {
    const { w, h } = this.state;

    return (
      <div className="screen">
        <div>!!! Under construction !!!</div>
        <section className="controls">
          <button
            title="import asset"
            className="btn"
            onClick={() => this.create()}
            disabled={false}
          >
            rnd color
          </button>
          <div>
            <label>Width:</label>
            <input type="text" onChange={e => this.onSize("w", e)} value={w} />
            <span style={{ display: "inline-block", width: 45 }} />
            <label>Height:</label>
            <input type="text" onChange={e => this.onSize("h", e)} value={h} />
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
