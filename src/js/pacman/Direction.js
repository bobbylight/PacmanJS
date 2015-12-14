var pacman;
(function (pacman) {
    'use strict';
    (function (Direction) {
        Direction[Direction["NORTH"] = 0] = "NORTH";
        Direction[Direction["EAST"] = 1] = "EAST";
        Direction[Direction["SOUTH"] = 2] = "SOUTH";
        Direction[Direction["WEST"] = 3] = "WEST";
    })(pacman.Direction || (pacman.Direction = {}));
    var Direction = pacman.Direction;
    var DirectionUtil = (function () {
        function DirectionUtil() {
        }
        DirectionUtil.fromString = function (str) {
            if (str === void 0) { str = 'SOUTH'; }
            switch (str.toUpperCase()) {
                case 'NORTH':
                    return pacman.Direction.NORTH;
                case 'EAST':
                    return pacman.Direction.EAST;
                case 'WEST':
                    return pacman.Direction.WEST;
                case 'SOUTH':
                default:
                    return pacman.Direction.SOUTH;
            }
        };
        return DirectionUtil;
    })();
    pacman.DirectionUtil = DirectionUtil;
})(pacman || (pacman = {}));

//# sourceMappingURL=Direction.js.map
