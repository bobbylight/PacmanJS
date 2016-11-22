var pacman;
(function (pacman) {
    'use strict';
    /**
     * Constants to use for keys in our assets.  We cannot use an enum since
     * TypeScript does not yet support enums of strings.
     */
    var Sounds = (function () {
        function Sounds() {
        }
        Sounds.CHASING_GHOSTS = 'chasingGhosts';
        Sounds.CHOMP_1 = 'chomp1';
        Sounds.CHOMP_2 = 'chomp2';
        Sounds.DIES = 'dies';
        Sounds.EATING_FRUIT = 'eatingFruit';
        Sounds.EATING_GHOST = 'eatingGhost';
        Sounds.EXTRA_LIFE = 'extraLife';
        Sounds.INTERMISSION = 'intermission';
        Sounds.EYES_RUNNING = 'eyesRunning';
        Sounds.OPENING = 'opening';
        Sounds.SIREN = 'siren';
        Sounds.TOKEN = 'token';
        return Sounds;
    }());
    pacman.Sounds = Sounds;
})(pacman || (pacman = {}));

//# sourceMappingURL=Sounds.js.map
