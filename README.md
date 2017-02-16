# PickPocket

An Atom package for grabbing existing art assets from a collection and copying them into your current project. A file manager for game prototyping.

![PickPocket](https://cloud.githubusercontent.com/assets/129330/17072386/ca12ef8e-5035-11e6-8626-19ccd95f3266.gif)

* **Install the package** (TODO: add instructions)
* **Dump a bunch of images in a directory** ([`<plugin root>/example`](https://github.com/mrspeaker/pickpocket/tree/master/example) by default - change this location in [`settings`](atom://config/packages/pickpocket)).
* Launch PickPocket with **`ctrl-alt-p` (`pickpocket:toggle`)**.
* Select image (and rename it if you want) then hit `import`.

The image is copy & renamed to the target dir. If you select `open in editor`, the local copy will be opened in your image editor (`aseprite` by default: change this in [`settings`](atom://config/packages/pickpocket)).

When you import an image, the local path is also copied to the clipboard as a string - so you can paste it into your code.

## Effects

Select an image and hit `fx`. This switches to effects mode where you can modify it before importing.
Currently there are only a couple of functions: Flip x and y, rotate 90 degrees as well as a half-baked hue modification. More to come.

![PickPocket](https://cloud.githubusercontent.com/assets/129330/17072516/e57a0e00-5036-11e6-9293-493de4d643b1.png)

## Roadmap

Nope. Here's [some things I'm thinking about](https://github.com/mrspeaker/pickpocket/issues/3) though.
