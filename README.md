PacmanJS - A Pacman clone in TypeScript
=======================================
Like it says on the tin.  This reproduction will try to be as authentic as
possible.  Feel free to [try it out in its current state](http://bobbylight.github.io/PacmanJS/).

Licensed under [an MIT license](LICENSE.txt).

## Hacking
This game depends on `gulp` for its builds and `bower` for its runtime
dependencies.  To install these if you don't already have them:

```shell
npm install -g gulp
npm install -g bower
```

Next, check out the project, install `gulp` locally, and run `bower` to pull
down all dependencies.

```shell
git clone https://github.com/bobbylight/PacmanJS.git
cd PacmanJS
npm install
bower install
```

The source code lives in `src/app`.  You can build both the development and
production (minified) versions of the game by running `gulp`.  The development
version will be built in `src/js` and the production version in `dist/`.

## What's unimplemented/buggy

* Blinky is the only ghost currently implemented
* "READY!" state does not hold for 2.5 seconds when a new level starts
* Black in Pacman/ghost/eyes sprites should be translucent, not black
* High score is not preserved between games
* Sound effects don't always stop/restart properly when the game is paused
* Seems like there's a bug in Blinky's movement?  e.g. when hovering in a
  corner before chasing Pacman
