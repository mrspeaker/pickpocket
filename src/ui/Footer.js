"use babel";

import React from "react";

const styles = {
  container: {
    height: 5
  },
  gitLink: {
    color: "#777",
    position: "absolute",
    bottom: 0,
    right: 10
  }
};

const Footer = () => (
  <footer className="header" style={styles.container}>
    <a className="text-smaller" style={styles.gitLink} href="https://github.com/mrspeaker/pickpocket">
      PickPocket by Mr Speaker
    </a>;
  </footer>
);

export default Footer;
