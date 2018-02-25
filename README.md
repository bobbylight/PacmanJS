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
1. Tests don't work after the conversion to commonjs:

```bash
$ npm run test
...
26 11 2016 23:36:45.386:INFO [PhantomJS 2.1.1 (Windows 8 0.0.0)]: Connected on socket /#-09u1FLuLHy2SV_8AAAA with id 61737670
PhantomJS 2.1.1 (Windows 8 0.0.0) ERROR
  TypeError: undefined is not an object (evaluating 'b.prototype')
  at src/app/test.ts:3574
PhantomJS 2.1.1 (Windows 8 0.0.0): Executed 0 of 0 ERROR (0.077 secs / 0 secs)
```
