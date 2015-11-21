PacmanJS - A Pacman clone in JavaScript
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
    
The development version of the game lives in `src/`.  You can build the
production version of it into `dist/` by running `gulp`.
