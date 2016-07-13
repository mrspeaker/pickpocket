# Pickpocket

An Atom package for grabbing existing art assets from a collection, and copying them into the current project. A file manager for game prototyping.

![Pickpocket](https://cloud.githubusercontent.com/assets/129330/15506386/6c08650a-2195-11e6-9b22-d25fea6dc3a5.png)

To use it, **install the package** (TODO: instructions!) then **dump a bunch of images in a directory** (`"/tmp/"` by default - change this location in `settings`).

Then **`ctrl-alt-p` (`pickpocket:toggle`) to launch**. Type the directory to copy img to, select image (and rename it if you want) then hit `import`. The image is copy & renamed to the target dir.

If you select `open in editor` the local copy will be opened in your image editor (`aseprite` by default: change this in `settings`).

When you import an image, the local path is also copied to the clipboard as a string - so you can paste it into your code.

### Pickpocket TODOs

  * Finish react-fiying
    * enter to import
    * auto focus textbox
    * reset treepath on delete-all-text
    * esc to close

  * store "open in editor" checkbox as pref
  * preview selected img
  * enter to select
  * show img size
  * tree folder selection
    * tree navigation
  * handle missing path /'s anywhere
    * settings
    * url bar
    * onClose
  * make modal wider
  * use atom buttons
  * handle when no root project
  * copy-to-clipboard as "string", "phaser image", "phaser tilemap"
  * ask to overwrite if img exists
    * rename-if-overwriting option
  * proper error handling for file operations
  * allow ~ for home path
  * option to copy file to clipboard on select

### choosing where to save

  * Path should indicate warning as typing if not real path (dirs don't exist)
  * if img doesn't exist, option to choose image?
    * or create blank
    * with X, Y size
  * Option to create folders if path doesn't exist

### bigger picture / later

  * infinte scroll, lazy load
  * asset generation
    * select dimensions
    * generate stylized circle / rectangle etc
    * tilemaps
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
