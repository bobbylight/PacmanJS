# PacmanJS - A Pacman clone in TypeScript
![Build](https://github.com/bobbylight/PacmanJS/actions/workflows/build.yml/badge.svg)
![CodeQL](https://github.com/bobbylight/PacmanJS/actions/workflows/codeql-analysis.yml/badge.svg)
[![codecov](https://codecov.io/gh/bobbylight/PacmanJS/branch/master/graph/badge.svg?token=1AzwBREy4R)](https://codecov.io/gh/bobbylight/PacmanJS)

Like it says on the tin.  This reproduction will try to be as authentic as
possible.  Feel free to [try it out in its current state](http://bobbylight.github.io/PacmanJS/).

Licensed under [an MIT license](LICENSE.txt).


## Hacking
To install, compile, and run locally:

```bash
git clone https://github.com/bobbylight/PacmanJS.git
cd PacmanJS
npm install
npm run dev  # Start dev server at localhost:5173, hot deploy changes
npm run build  # Production build into dist/
```


## Electron Support
*Note: Currently broken since we've moved off of webpack!*

Besides browser support, a native version of the game can be built using
electron.  See the `build:electron`, `dist:electron` and other related tasks below.


## npm scripts

* `clean`: Deletes prior build artifacts
* `build`: Builds production artifact into `build/web/`
* `dev`:   Runs a dev server on http://localhost:5173 and hot-deploys changes
* `lint`: Lints the project
* `test`: Runs unit tests and generates coverage report in `coverage/`
* `build:electron`: Builds all electron artifacts into `build/electron/`
* `start:electron`: Starts the election app built via `build:electron`
* `pack:electron`: Generates a native application into `dist/` that wraps the app built by `build:electron`
* `dist:electron`: Generates a native application and installer in `dist/`


## What's unimplemented/buggy
Relatively in the order in which I want to fix things:

* The electron app doesn't resize the game's canvas to fit the window as it is resized
* Sound effects don't always stop/restart properly when the game is paused
* Intermissions are not yet implemented
* Ghost AI is approximate to, but not exactly, the actual algorithms
* Blinky does not turn into Cruise Elroy, or increase in speed, as a level
  goes on
