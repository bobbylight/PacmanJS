import {DirectionUtil, Direction} from './Direction';

describe('DirectionUtil', () => {

	it('Test test :)', () => {

		expect(DirectionUtil.fromString('SOUTH')).toEqual(Direction.SOUTH);
	});
});
