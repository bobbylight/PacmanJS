PacmanJS - A Pacman clone in TypeScript
=======================================
Like it says on the tin.  This reproduction will try to be as authentic as
possible.

## Hacking
This game depends on `gulp` for its builds and `bower` for its runtime
dependencies.  To install these if you don't already have them:

    npm install -g gulp
    npm install -g bower

Next, check out the project, install `gulp` locally, and run `bower` to pull
down all dependencies.

    git clone https://github.com/bobbylight/PacmanJS.git
    cd PacmanJS
    npm install
    bower install

The source code lives in `src/`.  You can build both the development and
production (minified) versions of the game by running `gulp`.  The development
version will be built in `src/` and the production version in `dist/`.
