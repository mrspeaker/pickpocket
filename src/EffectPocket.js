"use babel";

import React from "react";
import Footer from "./ui/Footer";

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
    imgPath: PropTypes.string
  };

  state = {
  };

  render () {

    const { onClose, imgPath } = this.props;

    return <div className="pickpocket">

      <section className="input-block find-container">
        <div className="btn-group" style={{width:"100%"}}>
          <button className="btn" onClick={() => {}} >import</button>
          <div className="icon icon-x" onClick={onClose} style={styles.closeIcon}></div>
        </div>
      </section>

      <section>
        <div>
          <div>{imgPath}</div>
          <img src={ imgPath } />
        </div>
      </section>

      <Footer />

    </div>;
  }

}

export default EffectPocket;
