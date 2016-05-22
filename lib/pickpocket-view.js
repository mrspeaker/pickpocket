"use babel";
const atom = global.atom;

export default class PickpocketView {

  constructor( serializedState, toggleModal, onChoosed ) {

    this.path = "res/";
    this.selectedImg = "";

    this.toggleModal = toggleModal;
    this.onChoosed = onChoosed;

    this.element = document.createElement( "div" );
    this.element.classList.add( "pickpocket" );
    this.element.appendChild(
      this.createUI()
    );

  }

  createUI () {

    const inner = document.createElement( "div" );
    inner.innerHTML = `
<button id="close">close</button>
<button id="choose">choose</button>
<input type="checkbox" id="doOpen"><label for="doOpen">Open in editor</label>
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
    editor.setText( this.path );
    $( "#ed" ).appendChild( atom.views.getView( editor ) );

    this.doOpen = () => $( "#doOpen" ).checked;

    return inner;

  }

  onClose () {

    this.path = this.getPath();

    this.deselectEverything();
    this.toggleModal();

  }

  onChoose () {

    this.path = this.getPath();
    this.onChoosed( this.editor.getText(), this.selectedImg, this.doOpen() );

    this.deselectEverything();
    this.toggleModal();

  }

  onThumbClicked ( { target } ) {

    const { path } = target.dataset;

    if ( path ) {

      this.path = this.getPath();
      this.selectedImg = path;
      this.editor.setText( this.path + this.selectedImg );

    }

  }

  getPath () {

    return this.editor
      .getText()
      .split( "/" )
      .slice( 0, -1 )
      .join( "/" ) + "/";

  }

  setThumbs ( thumbs, assetRoot ) {

    const makeSelectable = path => {

      const img = new Image();
      img.src = assetRoot + path;
      img.dataset.root = assetRoot;
      img.dataset.path = path;
      return img;

    };

    const dom = this.element.querySelector( "#thumbs" );
    const imgs = thumbs.map( t => makeSelectable( t ) );

    // TODO: domfragment-ize
    dom.innerHTML = "";
    imgs.forEach( i => dom.appendChild( i ) );

  }

  deselectEverything () {

    this.selectedImg = "";
    // Remove selected class...
    this.editor.setText( this.path );

  }

  serialize() {}

  destroy() {

    this.element.remove();

  }

  getElement() {

    return this.element;

  }

}
