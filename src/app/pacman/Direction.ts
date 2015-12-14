module pacman {
	'use strict';

	export enum Direction {
		NORTH = 0,
		EAST = 1,
		SOUTH = 2,
		WEST = 3
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