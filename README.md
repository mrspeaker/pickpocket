# PickPocket

PickPocket is an [Atom package](https://atom.io/packages/pickpocket) for grabbing existing art assets from a collection and copying them into your current project. A file manager for game prototyping.

![PickPocket](https://cloud.githubusercontent.com/assets/129330/17072386/ca12ef8e-5035-11e6-8626-19ccd95f3266.gif)

## Usage

* Install the package (Atom -> preferences -> install -> "pickpocket")
* Launch PickPocket with **`ctrl-alt-p` (`pickpocket:toggle`)**.
* Select image (and rename it if you want) then hit `import`.

The image is copied & renamed to the currently selected directory in your project. However, the assets you can choose are just a few examples (from [`<plugin root>/example`](https://github.com/mrspeaker/pickpocket/tree/master/example)) to get you started. You need to bring your own!

* Dump a bunch of image assets in a directory somewhere, and put this location in `settings`.

If you select `import, then edit`, the local copy will be opened in your image editor (`aseprite` by default: change this in `settings`). When you import an image, the local path is also copied to the clipboard as a string - so you can paste it into your code.

## Effects

Select an image and hit `effects` ![fx](https://cloud.githubusercontent.com/assets/129330/23103327/c67b95ee-f687-11e6-8fd7-3de171d18687.png). This switches to effects mode where you can modify it before importing.
Currently there are a few effects you can apply: Flip x and y, rotate 90 degrees as well as some color effects (hue rotate, saturation, contrast, brightness). More to come.

![effects screen](https://cloud.githubusercontent.com/assets/129330/23129662/88ba08e2-f751-11e6-95c1-11e569f98264.png)

## Roadmap

Here's [some things I'm thinking about](https://github.com/mrspeaker/pickpocket/issues/3).

![PickPocket](https://cloud.githubusercontent.com/assets/129330/17072516/e57a0e00-5036-11e6-9293-493de4d643b1.png)
