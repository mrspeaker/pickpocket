"use babel";

import React from "react";
import Footer from "../ui/Footer";

const {
  Component,
  PropTypes
} = React;

const styles = {
  closeIcon: {
    cursor:"pointer",
    display:"inline-block",
    float:"right",
  }
};

class EffectPocket extends Component {

  static propTypes = {
    onClose: PropTypes.func.isRequired,
    onImport: PropTypes.func.isRequired,
    onSwitchMode: PropTypes.func.isRequired,
    asset: PropTypes.object.isRequired
  };

  state = {
    hueRotate: 0,
    saturate: 0,
    contrast: 0,
    brightness: 0,

    flip: {
      x: false,
      y: false
    },

    rotate90: false
  };

  componentDidMount () {
    this.effect();
  }

  effect () {

    const canvas = this.refs.canvas;
    if (!canvas || !canvas.getContext) { return; }
    const {hueRotate, saturate, contrast, brightness, flip, rotate90} = this.state;
    const {x, y} = flip;

    const ctx = canvas.getContext("2d");
    const img = new Image();
    img.src = this.props.asset.fullPath;

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
        ctx.rotate(-Math.PI/2);
        ctx.translate(-img.width / 2, -img.height / 2);
      }

      ctx.drawImage(img, 0, 0);

      const filters = [
        hueRotate > 0 ? `hue-rotate(${(hueRotate / 100) * 360 | 0}deg)` : null,
        saturate > 0 ? `saturate(${(saturate / 100) * 300}%)` : null,
        contrast > 0 ? `contrast(${(contrast / 100) * 300}%)` : null,
        brightness > 0 ? `brightness(${(brightness / 100) * 300}%)` : null
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

  onImport = () => {
    this.props.onImport(this.refs.canvas);
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

    const { onClose, onSwitchMode, asset } = this.props;
    const { flip, rotate90, hueRotate, saturate, contrast, brightness } = this.state;

    this.effect(); // TODO: move to Canvas, do effects reactively.

    return <div className="pickpocket">

      <section className="input-block find-container">
        <div className="btn-group" style={{width:"100%"}}>
          <button className="btn" onClick={this.onImport}>import</button>
          <button className="btn" onClick={() => onSwitchMode()}>back</button>
          <div className="icon icon-x" onClick={onClose} style={styles.closeIcon}></div>
        </div>
      </section>

      <section>
        <span style={{display: "inline-block", width: 70}}>Hue rotate: </span><input style={{display: "inline", width: 200}} type="range" onChange={e => this.onSliderChange("hueRotate", e)} value={hueRotate} />
        <span style={{display: "inline-block", width: 70}}>Saturation: </span><input style={{display: "inline", width: 200}} type="range" onChange={e => this.onSliderChange("saturate", e)} value={saturate} />
        <br/>
        <span style={{display: "inline-block", width: 70}}>Contast: </span><input style={{display: "inline", width: 200}} type="range" onChange={e => this.onSliderChange("contrast", e)} value={contrast} />
        <span style={{display: "inline-block", width: 70}}>Brightness: </span><input style={{display: "inline", width: 200}} type="range" onChange={e => this.onSliderChange("brightness", e)} value={brightness} />
        <br/>
        Flip X: <input type="checkbox" onChange={() => this.onFlip("x")} checked={flip.x} />{" "}
        Flip Y: <input type="checkbox" onChange={() => this.onFlip("y")} checked={flip.y} />{" "}
        Rotate 90: <input type="checkbox" onChange={this.onRotate} checked={rotate90} />
      </section>

      <section>
        <div style={{textAlign: "center", paddingTop: 20, paddingBottom: 20}}>
          <img src={ asset.fullPath } style={{ maxWidth: "50%" }} />
          <canvas ref="canvas" style={{verticalAlign:"middle", paddingLeft:20, maxWidth: "50%"}}/>
        </div>
      </section>

      <Footer />

    </div>;
  }

}

export default EffectPocket;
