"use babel";

import React from "react";

const Preview = ({src, onClose}) => {
  return <div className="preview" onClick={onClose} style={{
    backgroundImage: `url("${src}")`,
    backgroundSize: "contain",
    backgroundRepeat: "no-repeat",
    //background-attachment: fixed;
    backgroundPosition: "center"
  }}></div>;
};

export default Preview;
