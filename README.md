# Pickpocket

An Atom package for grabbing existing art assets from a collection, and copying them into the current project. A file manager for game prototyping.

![Pickpocket](https://cloud.githubusercontent.com/assets/129330/15506386/6c08650a-2195-11e6-9b22-d25fea6dc3a5.png)

To use it, **install the package** (TODO: instructions!) then **dump a bunch of images in a directory** (`"/tmp/"` by default - change this location in `settings`).

Then **`ctrl-alt-p` (`pickpocket:toggle`) to launch**. Type the directory to copy img to, select image (and rename it if you want) then hit `import`. The image is copy & renamed to the target dir.

If you select `open in editor` the local copy will be opened in your image editor (`aseprite` by default: change this in `settings`).

When you import an image, the local path is also copied to the clipboard as a string - so you can paste it into your code.

### Pickpocket

next todos:
  * preview selected img
  * esc to close
  * enter to select
  * no user-select on dialog
  * [done] selected thumbnail state
    * toggle selected
  * move asset root to settings
  * move sprite editor to settings
  * show img size overlay on hover
  * tree folder selection
  * Disallow typing-in-current-tab when in modal
  * Arrow navigation
  * handle missing path /'s anywhere
    * settings
    * url bar
    * onClose
  * copy-to-clipboard as "string", "phaser image", "phaser tilemap"
  * ask to overwrite if img exists
    * rename-if-overwriting option
  * note in status bar after copied "blah.png copied to /res/images"
  * proper error handling for file operations
  * allow ~ in path

  * [done] better name for project.
  * [done] on run -> copy any-old image from somewhere to current directory.
  * [done] click selects image, and populates texteditor path
    * [done] when come back, image name is gone, only path remains
  * [done] rename-on-copy    /res/images/[selectedname.png] <- can easily rename
  * [done] reads directory/s of images
    * [done] lets you choose one
    * [done] copies them to the save location

### choosing where to save
  * [done] if string selected, use that as dir (and name?)
  * [done] else path-selector
    * [done] if previous-chosen-in-session, pre-populate dir
  * Path should indicate error if not real path (dirs don't exist)
  * if img doesn't exist, option to choose image?
    * or create blank
    * with X, Y size
  * Option to create folders if path doesn't exist
  * [done] option to open in pixelmator/aseprite

### bigger picture / later
  * asset generation
    * select dimensions
    * generate stylized circle/rectangle etc
    * tilemaps
  * multi-user, central store
  * link via CDN instead of copying
  * auto + manual tint/dsp to match game
  * create server/db? grab imgs from url?
    * should be able to do both: local directories+server
      * like Ableton - set of directories to search
    * synced to github
    * plugged in to opengameart etc
  * SIP-style copy options. [copy as]:
    * plain string: `"res/player.png"`
    * Phaser.io image: `load.image( "player", "res/player.png" );`
    * etc... maybe a template system `${path}/${name} - ${w} ${h}`
  * on-import modifications
    * Resize (up or down)
    * flip x, y, x + y
    * Create sprite sheet from single cell (flipped version)
    * Choose a tile from a tilemap
  * preview img on select
    * x1, x2, x4 picture-in-picture
    * change background-color
  * preview from string
    * if you select path in current tabs, then open PP
  * option to copy, copy-with-resize, copy-with-dsp.
  * Select/import multiple
  * "discovery" tools
    * favourites
    * search (by what? metadata?)
      * categories/tags
      * similar images
