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
    hue: {
      on: false,
      r: 0,
      g: 0,
      b: 0,
      a: 50
    },

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
    if (!canvas) { return; }
    const {hue, flip, rotate90} = this.state;
    const {on: doHue, r, g, b, a} = hue;
    const {x, y} = flip;

    const tint = document.createElement("canvas");
    const tintCtx = tint.getContext("2d");

    if (!canvas.getContext) {
      return;
    }
    const ctx = canvas.getContext("2d");
    const img = new Image();
    img.src = this.props.asset.fullPath;

    img.onload = () => {
      const {width, height} = img;
      canvas.width = tint.width = rotate90 ? height : width;
      canvas.height = tint.height = rotate90 ? width : height;

      if (x || y) {
        ctx.translate(x ? canvas.width : 0, y ? canvas.height : 0);
        ctx.scale(x ? -1 : 1, y ? -1 : 1);
      }

      if (rotate90) {
        ctx.translate(canvas.width / 2,canvas.height / 2);
        ctx.rotate(-Math.PI/2);
        ctx.translate(-img.width / 2, -img.height / 2);
      }

      if (doHue) {
        tintCtx.fillStyle = `rgb(${(r / 100) * 255 | 0}, ${(g / 100) * 255 | 0}, ${(b / 100) * 255 | 0})`;
        tintCtx.fillRect(0, 0, tint.width, tint.height);
        tintCtx.globalCompositeOperation = "destination-atop";
        tintCtx.drawImage(img, 0, 0);
      }

      ctx.drawImage(img, 0, 0);

      if (doHue) {
        ctx.globalAlpha = a / 100;
        ctx.drawImage(tint, 0, 0);
      }
    };
  }

  onHueChange (component, e) {
    const hue = Object.assign({}, this.state.hue);
    if (component === "on") {
      hue.on = !hue.on;
    } else {
      hue[component] = e.target.value;
    }
    this.setState({
      hue
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
    const { hue, flip, rotate90 } = this.state;
    const { on: hueOn, r, g, b, a } = hue;

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
        Hue:<input type="checkbox" onChange={() => this.onHueChange("on")} checked={hueOn} />
        {hueOn && <div>
          <span style={{display: "inline-block", width: 20}}>r</span><input style={{display: "inline", width: 200}} type="range" onChange={e => this.onHueChange("r", e)} value={r} />
          <span style={{display: "inline-block", width: 20, marginLeft: 30}}>a</span><input style={{display: "inline", width: 200}} type="range" onChange={e => this.onHueChange("a", e)} value={a} /><br/>
          <span style={{display: "inline-block", width: 20}}>g</span><input style={{display: "inline", width: 200}} type="range" onChange={e => this.onHueChange("g", e)} value={g} /><br/>
          <span style={{display: "inline-block", width: 20}}>b</span><input style={{display: "inline", width: 200}} type="range" onChange={e => this.onHueChange("b", e)} value={b} /><br/>
        </div>}
      </section>

      <section>
        Flip X: <input type="checkbox" onChange={() => this.onFlip("x")} checked={flip.x} />
        {" "}
        Flip Y: <input type="checkbox" onChange={() => this.onFlip("y")} checked={flip.y} />
        {" "}
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
