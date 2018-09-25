# PickPocket

PickPocket is an [Atom package](https://atom.io/packages/pickpocket) for grabbing existing art assets from a collection and copying them into your current project. A file manager for game prototyping.

![PickPocket](https://user-images.githubusercontent.com/129330/46024384-afbf5b80-c0b4-11e8-964d-14d410cc9159.png)

(previous non-dock version:)

![PickPocket modal](https://cloud.githubusercontent.com/assets/129330/17072386/ca12ef8e-5035-11e6-8626-19ccd95f3266.gif)

## Usage

* Install the package (Atom -> preferences -> install -> "pickpocket")
* Launch PickPocket with **`ctrl-alt-p` (`pickpocket:toggle`)**.
* Select image (and rename it if you want) then hit `import`.

The image is copied & renamed to the currently selected directory in your project. However, the assets you can choose are just a few examples (from [`<plugin root>/example`](https://github.com/mrspeaker/pickpocket/tree/master/example)) to get you started. You need to bring your own!

* Dump a bunch of image assets in a directory somewhere, and put this location in `settings`.

If you select `import + open`, the local copy will be opened in your image editor (`aseprite` by default: change this in `settings`). When you import an image, the local path is also copied to the clipboard as a string - so you can paste it into your code.

## Local project viewer

The `project` tab will show images already in your local project. You can `open` them in the current editor, or rename them to save-as a new duplicate image. You can also apply some effects with the `effects` button.

## Effects

Select either a `project` or `pocket` image and hit `effects` ![fx](https://cloud.githubusercontent.com/assets/129330/23103327/c67b95ee-f687-11e6-8fd7-3de171d18687.png). This turns on effects mode where you can modify it before importing.
Currently there are a few effects you can apply: Flip x and y, rotate 90 degrees as well as some color effects (hue rotate, saturation, contrast, brightness). More to come.

<img width="304" alt="effects screen" src="https://user-images.githubusercontent.com/129330/46024634-3c6a1980-c0b5-11e8-8bd0-bc9ffd03b22c.png">


Note: the effects are applied using HTML5 canvas, and the saved files will (for now) only be PNG files.

## Roadmap

Here's [some things I'm thinking about](https://github.com/mrspeaker/pickpocket/issues/3). Let me know if you have any suggestions for features you'd like to see.
