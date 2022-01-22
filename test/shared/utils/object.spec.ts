import {
  createMappedPropertySet,
  getStringifiedEntries,
} from '../../../src/shared/utils/object';

describe('object', () => {
  describe('getStringifiedEntries', () => {
    const mockObject = { b: 2, a: 3 };

    it('should return a string', () => {
      const result = getStringifiedEntries(mockObject);
      expect(typeof result).toBe('string');
    });

    it('should return the correct sorted properties', () => {
      const result = getStringifiedEntries(mockObject);
      const expectedResult = JSON.stringify([
        ['a', 3],
        ['b', 2],
      ]);
      expect(result).toBe(expectedResult);
    });
  });

  describe('createMappedPropertySet', () => {
    const mockArray = [
      { c: 2, b: 3, a: 4 },
      { a: 2, c: 3, b: 4 },
    ];
    it('should return a correct mapped object with stringified keys', () => {
      const result = createMappedPropertySet(mockArray, ['b', 'a']);
      const expectedResult = {
        '[["a",4],["b",3]]': { c: 2, b: 3, a: 4 },
        '[["a",2],["b",4]]': { a: 2, c: 3, b: 4 },
      };
      expect(result).toEqual(expectedResult);
    });
  });
});
