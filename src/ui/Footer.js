"use babel";

import React from "react";

const Footer = () => {
  return <footer className="header">
    <span className="header-item description">
      <span className="subtle-info-message">Close this panel with the
        <span className="highlight">esc</span> key
      </span>
    </span>
    <span className="header-item options-label pull-right">
      <span>Options: </span>
      <span className="options">{"don't open editor"}</span>
    </span>
  </footer>;
};

export default Footer;
