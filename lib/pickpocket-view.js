"use babel";

const atom = global.atom;
import fs from "fs";

export default class PickpocketView {

  constructor( serializedState, toggleModal, onChoosed ) {

    this.path = "";
    this.selectedImg = "";

    this.toggleModal = toggleModal;
    this.onChoosed = onChoosed;

    this.element = document.createElement( "div" );
    this.element.classList.add( "pickpocket" );
    this.element.appendChild(
      this.createUI()
    );

    // Pretty sure this isn't how you're supposed to make
    // a modal act like a modal, but whatever...
    this.element.addEventListener( "mousedown", e => {

      atom.views.getView( this.editor ).focus();
      e.preventDefault();
      e.stopPropagation();

    });

  }

  createUI () {

    const inner = document.createElement( "div" );
    inner.innerHTML = `
<div id="tools">
  <button id="close">close</button>
  <button id="choose">import</button>
  <input type="checkbox" id="doOpen"><label for="doOpen">Open in editor</label>
</div>
<div id="ed"></div>
<div id="thumbs"></div>
`;

    // Mini query
    const $ = ( id, f ) => {

      const el = inner.querySelector( id );
      f && el.addEventListener( "click", f.bind( this ), false );

      return el;

    };

    $( "#close", this.onClose );
    $( "#choose", this.onChoose );
    $( "#thumbs", this.onThumbClicked );

    const editor = this.editor = atom.workspace.buildTextEditor({ mini: true });
    $( "#ed" ).appendChild( atom.views.getView( editor ) );

    this.doOpen = () => $( "#doOpen" ).checked;

    return inner;

  }

  onClose () {

    const path = this.getPath();
    // Clear path if was auto populated, and not changed
    const isAutoPop = this.autoPopulateDir && path === this.autoPopulateDir;
    this.path = isAutoPop ? "" : path;

    this.deselectEverything();
    this.toggleModal(true);

  }

  onChoose () {

    this.path = this.getPath();
    const projectRoot = atom.project.getDirectories()[ 0 ].path + "/";

    if ( !fs.existsSync( projectRoot + this.path ) ) {

      const doMakeDir = confirm ( "Directory " + this.path + " does not exist.\nDo you want to create it?" );
      if ( !doMakeDir ) {

        return;

      }

      // TODO: make it work if nested
      fs.mkdirSync( projectRoot + this.path );

    }

    this.onChoosed( this.editor.getText(), this.selectedImg, this.doOpen() );

    this.deselectEverything();
    this.toggleModal(true);

  }

  onThumbClicked ( { target } ) {

    if ( ! target.classList.contains( "thumb" ) ) {
      target = target.parentNode;
      if ( ! target.classList.contains( "thumb" ) ) {
        return;
      }
    }

    const selected = target.parentNode.querySelector( ".selected" );
    if ( selected ) {
      selected.classList.remove( "selected" );
    }

    if ( selected === target ) {

      this.selectedImg = "";
      this.setPath( this.getPath() );
      return;
      
    }

    const { path } = target.dataset;
    if ( path ) {

      target.classList.add( "selected" );
      this.selectedImg = path;
      this.setPath( this.getPath() );

    }

  }

  getPath () {

    const edText = this.editor.getText();
    if ( !edText ) return "";

    return edText
      .split( "/" )
      .slice( 0, -1 )
      .join( "/" ) + "/";

  }

  setPath ( path ) {

    // TODO: if path not exist, show warning
    this.path = path;
    this.editor.setText( path + this.selectedImg );

  }

  setThumbs ( dirs, assets, assetRoot ) {

    let autoPopulateDir = false;

    // TODO: if onClose === auto-gen path, clear path.
    if ( this.path === "" ) {

      // Grab current path from tree-view
      const tree = atom.packages.getActivePackage("tree-view");
      if ( tree ) {
        const { treeView } = tree.mainModule;
        const { selectedPath } = treeView;
        const isFile = !!( treeView.entryForPath( selectedPath ).file );
        const folderPath = !isFile ? selectedPath : selectedPath.split( "/").slice( 0, -1 ).join( "/" );
        const [ , relativePath ] = atom.project.relativizePath( folderPath );
        const trailing = relativePath ? "/" : "";
        this.setPath( `/${ relativePath }${ trailing }` );
        autoPopulateDir = true;
      }

    }

    this.autoPopulateDir = autoPopulateDir ? this.getPath() : "";

    const makeSelectable = asset => {

      const cont = document.createElement( "div" );
      cont.className = "thumb";

      const meta = document.createElement( "div" );
      meta.className = "meta";
      meta.innerHTML = asset.size;

      const metaName = document.createElement( "div" );
      metaName.className = "metaName";
      metaName.innerHTML = asset.name.split(".").slice(0, -1).join(".");

      const img = new Image();
      img.src = assetRoot + asset.name;
      cont.dataset.root = assetRoot;
      cont.dataset.path = asset.name;

      cont.appendChild( img );
      cont.appendChild( metaName );
      cont.appendChild( meta );

      return cont;

    };

    const dom = this.element.querySelector( "#thumbs" );
    const imgs = assets.map( a => makeSelectable( a ) );

    // TODO: domfragment-ize
    dom.innerHTML = "";
    imgs.forEach( i => dom.appendChild( i ) );

    // WHY?!
    setTimeout(() => {
      atom.views.getView( this.editor ).focus();
    }, 0);



  }

  deselectEverything () {

    this.selectedImg = "";
    this.setPath( this.path );

  }

  serialize() {}

  destroy() {

    this.element.remove();

  }

  getElement() {

    return this.element;

  }

}
