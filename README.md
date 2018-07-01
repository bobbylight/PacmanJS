PacmanJS - A Pacman clone in TypeScript
=======================================
Like it says on the tin.  This reproduction will try to be as authentic as
possible.  Feel free to [try it out in its current state](http://bobbylight.github.io/PacmanJS/).

Licensed under [an MIT license](LICENSE.txt).

## Hacking
To install and compile:

```shell
git clone https://github.com/bobbylight/PacmanJS.git
cd PacmanJS
npm install
npm run watch  # Start dev server at localhost:8080, hot deploy changes
npm run build  # Production build
```

The source code lives in `src`.  `webpack` is used to build the application into `build/web`.
A desktop build, built on `electron` is planned but not currently there due to technical
difficulties.

## What's unimplemented/buggy

Relatively in the order in which I want to fix things:

* Sound effects don't always stop/restart properly when the game is paused
* Intermissions are not yet implemented
* Ghost AI is approximate to, but not exactly, the actual algorithms
* Blinky does not turn into Cruise Elroy, or increase in speed, as a level
  goes on

## To-Do
1. Tests don't run for some reason:

```bash
$ npm run test
...
declare let game: PacmanGame;
        ^
TypeError: Object prototype may only be an Object or null: undefined
```
