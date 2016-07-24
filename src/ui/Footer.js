"use babel";

import React from "react";

const styles = {
  container: {
    fontSize:"7pt",
    height:5,
  },
  gitLink: {
    color: "#777",
    marginBottom:-8,
    position:"absolute",
    bottom:0,
    right: 0,
  }
};

const Footer = () => <footer className="header" style={styles.container}>
  <a style={styles.gitLink} href="https://github.com/mrspeaker/pickpocket">
    PickPocket by Mr Speaker
  </a>
</footer>;

export default Footer;
