# Pickpocket

Copies generated or existing art assets into current project for game prototyping. A filemanager for prototyping.

Dump a bunch of images in `"/Users/mrspeaker/assets/"` (will be setting soon, promise).

`ctrl-alt-p` (`pickpocket:toggle`) to launch. Type directory to copy img to, select image (and rename it if you want) then hit `choose`. THe image is copy & renamed to the target dir.

![Pickpocket](https://f.cloud.github.com/assets/69169/2290250/c35d867a-a017-11e3-86be-cd7c5bf3ff9b.gif)

### Pickpocket

next todos:
  * show selected img
  * esc to close
  * enter to select
  * move asset root to settings
  * move sprite editor to settings
  * show img size overlay on hover
  * tree folder selection
  * better name for project.
  * Disallow typing-in-current-tab when in modal
  * Arrow navigation

  * [done] on run -> copy any-old image from somewhere to current directory.
  * [done] click selects image, and populates texteditor path
    * [done] when come back, image name is gone, only path remains
  * [done] rename-on-copy    /res/images/[selectedname.png] <- can easily rename

### choose-existing workflow
  * choose where to save?
  * [done] reads directory/s of images
    * categories/tags
  * [done] lets you choose one
  * lets you choose multiple
  * lets you choose a tile from a tilemap
  * [done] copies them to the save location

### choosing where to save
  * [done] if string selected, use that as dir (and name?)
  * [done] else path-selector
    * [done] if previous-chosen-in-session, pre-populate dir
  * Path should indicate error if not real path (dirs don't exist)
  * Option to create folders if path doesn't exist

### bigger picture
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

### Maybe out-of-scope
  * if you select path, then trigger - shows preview of img
    * option to open in pixelmator/aseprite
    * if img doesn't exist, option to choose image? or create blank
      * with X, Y size
