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
    asset: PropTypes.object.isRequired
  };

  state = {
    r: 0,
    g: 0,
    b: 0,
    a: 50
  };

  componentDidMount () {
    this.effect();
  }

  effect () {

    const canvas = this.refs.canvas;
    if (!canvas) { return; }
    const {r, g, b, a} = this.state;

    const tint = document.createElement("canvas");
    const tintCtx = tint.getContext("2d");

    if (canvas.getContext) {
      const ctx = canvas.getContext("2d");
      const img = new Image();
      img.src = this.props.asset.fullPath;

      img.onload = () => {
        canvas.width = tint.width = img.width;
        canvas.height = tint.height = img.height;

        tintCtx.fillStyle = `rgb(${(r / 100) * 255 | 0}, ${(g / 100) * 255 | 0}, ${(b / 100) * 255 | 0})`;
        tintCtx.fillRect(0, 0, tint.width, tint.height);
        tintCtx.globalCompositeOperation = "destination-atop";
        tintCtx.drawImage(img, 0, 0);

        ctx.drawImage(img, 0, 0);
        ctx.globalAlpha = a / 100;
        ctx.drawImage(tint, 0, 0);
      };
    }
  }

  onSliderChange (component, e) {
    this.setState({
      [component]: e.target.value
    });
  }

  onImport = () => {
    this.props.onImport(this.refs.canvas);
  }

  render () {

    const { onClose, asset } = this.props;
    const { r, g, b, a } = this.state;

    this.effect(); // TODO: move to Canvas, do effects reactively.

    return <div className="pickpocket">

      <section className="input-block find-container">
        <div className="btn-group" style={{width:"100%"}}>
          <button className="btn" onClick={this.onImport}>import</button>
          <div className="icon icon-x" onClick={onClose} style={styles.closeIcon}></div>
        </div>
      </section>

      <section>
        <input type="range" onChange={e => this.onSliderChange("r", e)} value={r} />
        <input type="range" onChange={e => this.onSliderChange("g", e)} value={g} />
        <input type="range" onChange={e => this.onSliderChange("b", e)} value={b} />
        <input type="range" onChange={e => this.onSliderChange("a", e)} value={a} />
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
