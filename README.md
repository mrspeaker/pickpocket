# PickPocket

An Atom package for grabbing existing art assets from a collection, and copying them into the current project. A file manager for game prototyping.

![PickPocket](https://cloud.githubusercontent.com/assets/129330/17072386/ca12ef8e-5035-11e6-8626-19ccd95f3266.gif)

* **install the package** (TODO: add instructions)
* **dump a bunch of images in a directory** (`"/tmp/"` by default - change this location in [`settings`](atom://config/packages/pickpocket)).
* Launch PickPocket with **`ctrl-alt-p` (`pickpocket:toggle`)**. Select image (and rename it if you want) then hit `import`. The image is copy & renamed to the target dir.

If you select `open in editor`, the local copy will be opened in your image editor (`aseprite` by default: change this in [`settings`](atom://config/packages/pickpocket)).

When you import an image, the local path is also copied to the clipboard as a string - so you can paste it into your code.

![PickPocket](https://cloud.githubusercontent.com/assets/129330/17072516/e57a0e00-5036-11e6-9293-493de4d643b1.png)

### PickPocket TODOs

  * Add install instructions
  * handle missing/extra path /'s anywhere
    * settings asset path
    * url bar
  * proper error handling for file operations
  * Option to create folders if path doesn't exist

### Bigger picture / later

  * infinte scroll, lazy load
  * asset generation
    * select dimensions
    * generate stylized circle / rectangle etc
    * tilemaps
    * if img in path doesn't exist, option to create blank with X, Y size
  * sound preview/import
  * multi-user
    * central store
    * purchase-able
    * sell-able
  * link via CDN instead of copying
  * auto + manual tint / dsp to match game
  * create server/db? grab imgs from url?
    * should be able to do both: local directories+server
      * like Ableton - set of directories to search
    * synced to github
    * plugged in to opengameart etc
  * SIP-style format options. [copy as]:
    * plain string: `"res/player.png"`
    * Phaser.io image: `load.image( "player", "res/player.png" );`
    * etc... maybe a template system `${path}/${name} - ${w} ${h}`
  * on-import modifications
    * Resize (up or down)
    * flip x, y, x + y
    * Create sprite sheet from single cell (flipped version)
    * Choose a tile from a tilemap
    * copy-with-resize
    * copy-with-dsp (hue at least)
  * preview img on select
    * x1, x2, x4... picture-in-picture
    * change background-color
  * preview from string
    * if you select path in current tabs, then open PP
  * Select/import multiple at the same time
  * "discovery" tools
    * favourites
    * search (by what? metadata?)
      * categories/tags
      * similar images
  * library asset management
    * rename images
    * add meta data?
      * needs a client-side db?
      * isTilemap (tileW, tileH), licence, tags, crop params
    * edit image: scale, hue, crop etc
    * read xml/json sprite atlas info
