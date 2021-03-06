"use babel";

import React from "react";

const { Component, PropTypes } = React;

class Effector extends Component {
  static propTypes = {
    onSetFXCanvas: PropTypes.func.isRequired
  };

  state = {
    hueRotate: 0,
    saturate: 100,
    contrast: 100,
    brightness: 100,

    flip: {
      x: false,
      y: false
    },

    rotate90: false
  };

  componentDidMount() {
    this.effect();
    //this.props.onSetFXCanvas(this.refs.canvas);
  }

  effect() {
    const canvas = this.refs.canvas;
    if (!canvas || !canvas.getContext) {
      return;
    }
    const { asset } = this.props;
    const { fullPath } = asset;
    const {
      hueRotate,
      saturate,
      contrast,
      brightness,
      flip,
      rotate90
    } = this.state;
    const { x, y } = flip;

    const ctx = canvas.getContext("2d");
    const img = new Image();
    img.src = fullPath;
    img.onload = () => {
      const { width, height } = img;
      canvas.width = rotate90 ? height : width;
      canvas.height = rotate90 ? width : height;

      if (x || y) {
        ctx.translate(x ? canvas.width : 0, y ? canvas.height : 0);
        ctx.scale(x ? -1 : 1, y ? -1 : 1);
      }

      if (rotate90) {
        ctx.translate(canvas.width / 2, canvas.height / 2);
        ctx.rotate(Math.PI / 2);
        ctx.translate(-img.width / 2, -img.height / 2);
      }

      ctx.drawImage(img, 0, 0);

      const filters = [
        hueRotate > 0 ? `hue-rotate(${hueRotate}deg)` : null,
        saturate !== 100 ? `saturate(${saturate}%)` : null,
        contrast !== 100 ? `contrast(${contrast}%)` : null,
        brightness !== 100 ? `brightness(${brightness}%)` : null
      ].filter(f => !!f);

      if (filters.length) {
        const tint = document.createElement("canvas");
        tint.width = width;
        tint.height = height;
        const tintCtx = tint.getContext("2d");
        //tintCtx.fillStyle = `rgb(${(r / 100) * 255 | 0}, ${(g / 100) * 255 | 0}, ${(b / 100) * 255 | 0})`;
        //tintCtx.fillRect(0, 0, tint.width, tint.height);
        tintCtx.filter = filters.join(" ");
        tintCtx.globalCompositeOperation = "destination-atop";
        tintCtx.drawImage(img, 0, 0);

        //ctx.globalAlpha = a / 100;
        ctx.drawImage(tint, 0, 0);
      }
      this.props.onEffect(this.refs.canvas);
    };
  }

  onSliderChange(component, e) {
    this.setState({
      [component]: e.target.value
    }, this.effect);
  }

  onFlip = dir => {
    const flip = Object.assign({}, this.state.flip);
    flip[dir] = !flip[dir];
    this.setState({ flip }, this.effect);
  };

  onRotate = () => {
    this.setState(({ rotate90 }) => ({
      rotate90: !rotate90
    }), this.effect);
  };

  render() {
    const {
      flip,
      rotate90,
      hueRotate,
      saturate,
      contrast,
      brightness
    } = this.state;

    return (
      <div>
        <section className="controls" style={{userSelect: "none"}}>
          <label>Hue rotate:</label>
          <input
            type="range"
            className="slider input-range"
            min="0"
            max="360"
            onChange={e => this.onSliderChange("hueRotate", e)}
            value={hueRotate}
          />
          <span> </span>
          <label>Saturation:</label>
          <input
            min="0"
            max="300"
            type="range"
            className="slider input-range"
            onChange={e => this.onSliderChange("saturate", e)}
            value={saturate}
          />
          <br />
          <label>Contast:</label>
          <input
            type="range"
            className="slider input-range"
            min="0"
            max="300"
            onChange={e => this.onSliderChange("contrast", e)}
            value={contrast}
          />
          <span> </span>
          <label>Brightness:</label>
          <input
            className="slider input-range"
            type="range"
            min="0"
            max="300"
            onChange={e => this.onSliderChange("brightness", e)}
            value={brightness}
          />
          <div>
            <label>Flip X:</label>
            <input
              type="checkbox"
              className="input-checkbox"
              onChange={() => this.onFlip("x")}
              checked={flip.x}
            />{" "}
            <span style={{ display: "inline-block", width: 45 }} />
            <label>Flip Y:</label>
            <input
              type="checkbox"
              className="input-checkbox"
              onChange={() => this.onFlip("y")}
              checked={flip.y}
            />{" "}
            <span style={{ display: "inline-block", width: 45 }} />
            <label>Rotate 90:</label>
            <input
              type="checkbox"
              className="input-checkbox"
              onChange={this.onRotate}
              checked={rotate90}
            />
          </div>
        </section>
        <canvas style={{display: "none", position:"absolute", top: 0, left:0}}ref="canvas" />
      </div>
    );
  }
}

export default Effector;
