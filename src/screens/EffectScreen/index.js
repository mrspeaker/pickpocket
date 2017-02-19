"use babel";

import React from "react";
import Footer from "../../ui/Footer";

const {
  Component,
  PropTypes
} = React;

class EffectScreen extends Component {

  static propTypes = {
    assetName: PropTypes.string.isRequired,
    assetPath: PropTypes.string.isRequired,
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

  componentDidMount () {
    this.effect();
    this.props.onSetFXCanvas(this.refs.canvas);
  }

  effect () {

    const canvas = this.refs.canvas;
    if (!canvas || !canvas.getContext) { return; }
    const {assetPath, assetName} = this.props;
    const {hueRotate, saturate, contrast, brightness, flip, rotate90} = this.state;
    const {x, y} = flip;

    const ctx = canvas.getContext("2d");
    const img = new Image();
    img.src = assetPath + assetName;

    img.onload = () => {
      const {width, height} = img;
      canvas.width = rotate90 ? height : width;
      canvas.height = rotate90 ? width : height;

      if (x || y) {
        ctx.translate(x ? canvas.width : 0, y ? canvas.height : 0);
        ctx.scale(x ? -1 : 1, y ? -1 : 1);
      }

      if (rotate90) {
        ctx.translate(canvas.width / 2,canvas.height / 2);
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
    };
  }

  onSliderChange (component, e) {
    this.setState({
      [component]: e.target.value
    });
  }

  onFlip = (dir) => {
    const flip = Object.assign({}, this.state.flip);
    flip[dir] = !flip[dir];
    this.setState({flip});
  }

  onRotate = () => {
    this.setState(({rotate90}) => ({
      rotate90: !rotate90
    }));
  }

  render () {

    const { assetPath, assetName } = this.props;
    const { flip, rotate90, hueRotate, saturate, contrast, brightness } = this.state;

    this.effect(); // TODO: move to Canvas, do effects reactively.

    return <div className="screen">

      <section className="controls">
        <span style={{display: "inline-block", width: 70}}>Hue rotate: </span>
        <input style={{display: "inline", width: 180}} type="range" min="0" max="360" onChange={e => this.onSliderChange("hueRotate", e)} value={hueRotate} />
        <span>{" "}</span>
        <span style={{display: "inline-block", width: 70}}>Saturation: </span><input style={{display: "inline", width: 180}} min="0" max="300" type="range" onChange={e => this.onSliderChange("saturate", e)} value={saturate} />
        <br/>
        <span style={{display: "inline-block", width: 70}}>Contast: </span><input style={{display: "inline", width: 180}} type="range" min="0" max="300" onChange={e => this.onSliderChange("contrast", e)} value={contrast} />
        <span>{" "}</span>
        <span style={{display: "inline-block", width: 70}}>Brightness: </span><input style={{display: "inline", width: 180}} type="range" min="0" max="300" onChange={e => this.onSliderChange("brightness", e)} value={brightness} />
        <br/>
        Flip X: <input type="checkbox" onChange={() => this.onFlip("x")} checked={flip.x} />{" "}
        Flip Y: <input type="checkbox" onChange={() => this.onFlip("y")} checked={flip.y} />{" "}
        Rotate 90: <input type="checkbox" onChange={this.onRotate} checked={rotate90} />
      </section>

      <section>
        <div style={{textAlign: "center", paddingTop: 20, paddingBottom: 20}}>
          <img src={ assetPath + assetName } style={{ maxWidth: "50%" }} />
          <canvas ref="canvas" style={{verticalAlign:"middle", paddingLeft:20, maxWidth: "50%"}}/>
        </div>
      </section>

      <Footer />

    </div>;
  }

}

export default EffectScreen;
