module pacman {
	'use strict';

	export enum Direction {
		EAST = 0,
		SOUTH = 1,
		WEST = 2,
		NORTH = 3
	}

	export class DirectionUtil {

		static fromString(str: string = 'SOUTH') : Direction {
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
		}
	}
}
