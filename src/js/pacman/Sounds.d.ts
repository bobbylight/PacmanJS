declare module pacman {
    /**
     * Constants to use for keys in our assets.  We cannot use an enum since
     * TypeScript does not yet support enums of strings.
     */
    class Sounds {
        static CHASING_GHOSTS: string;
        static CHOMP_1: string;
        static CHOMP_2: string;
        static DIES: string;
        static EATING_FRUIT: string;
        static EATING_GHOST: string;
        static EXTRA_LIFE: string;
        static INTERMISSION: string;
        static EYES_RUNNING: string;
        static OPENING: string;
        static SIREN: string;
        static TOKEN: string;
    }
}
