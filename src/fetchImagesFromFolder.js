"use babel";

import fs from "fs";
import path from "path";

export default assetRoot => new Promise( res => {
  //const assetRoot = folder; // this.getAssetRoot();
  // TODO: check if valid (even non-existant) dir, err if not.
  fs.readdir(assetRoot, ( err, files ) => {

    let dirs = [];
    let imgs = [];

    files.forEach( f => {
      const fullPath = assetRoot + f;
      const file = fs.statSync( fullPath );
      if ( file.isDirectory() ) {

        dirs.push( {
          type: "directory",
          size: file.size,
          fullPath,
          name: f
        } );

        return;

      }

      const ext = path.extname( f );
      if ( [ ".png", ".jpg", ".gif" ].indexOf( ext ) !== -1 ) {

        imgs.push( {
          type: "image",
          size: file.size,
          fullPath,
          name: f
        } );

      }
      return null;
    });

    res({
      dirs,
      imgs
    });

    //this.pickpocketView.setThumbs( dirs, imgs, assetRoot );
  });

});
