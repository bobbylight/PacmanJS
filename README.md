# PacmanJS - A Pacman clone in TypeScript
Like it says on the tin.  This reproduction will try to be as authentic as
possible.  Feel free to [try it out in its current state](http://bobbylight.github.io/PacmanJS/).

Licensed under [an MIT license](LICENSE.txt).


## Hacking
To install, compile, and run locally:

```bash
git clone https://github.com/bobbylight/PacmanJS.git
cd PacmanJS
npm install
npm run watch  # Start dev server at localhost:8080, hot deploy changes
npm run build  # Production build
```


## Electron Support
Besides browser support, a native version of the game can be built using
electron.  See the `build:electron`, `dist:electron` and other related tasks below.


## npm scripts

* clean: Deletes prior build artifacts
* build: Builds production artifact into `build/web`
* watch: Runs a dev server on http://localhost:8080 and hot-deploys changes
* lint: Lints the project
* test: Runs unit tests
* build:electron: Builds all electron artifacts
* start:electron: Starts the election app built via `build:electron`
* pack:electron: Generates a native application wrapping the app built by `build:electron`
* dist:electron: Generates a native application and installer


## Running Tests
A coverage report will be generated in `coverage/index.html`:

```bash
npm run test
```

## What's unimplemented/buggy
Relatively in the order in which I want to fix things:

* The electron app doesn't resize the game's canvas to fit the window as it is resized
* Sound effects don't always stop/restart properly when the game is paused
* Intermissions are not yet implemented
* Ghost AI is approximate to, but not exactly, the actual algorithms
* Blinky does not turn into Cruise Elroy, or increase in speed, as a level
  goes on
