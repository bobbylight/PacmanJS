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

Relatively in the order in which I want to fix things:

* Fruit in a maze is not reset on game over/restart
* Sound effects don't always stop/restart properly when the game is paused
* Intermissions are not yet implemented
* Ghost AI is approximate to, but not exactly, the actual algorithms
* Blinky does not turn into Cruise Elroy, or increase in speed, as a level
  goes on
