pacman.Direction = Object.freeze({
   
   NORTH: 0,
   EAST: 1,
   SOUTH: 2,
   WEST: 3,
   
   fromString: function(str) {
      'use strict';
      if (!str || !str.length) {
         return pacman.Direction.SOUTH;
      }
      switch (str.toUpperCase()) {
         case 'NORTH':
            return pacman.Direction.NORTH;
         case 'EAST':
            return pacman.Direction.EAST;
         case 'WEST':
            return pacman.Direction.WEST;
         case 'SOUTH':
            return pacman.Direction.SOUTH;
         default:
            return pacman.Direction.SOUTH;
      }
   }
   
});
