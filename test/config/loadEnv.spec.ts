import loadEnv, { loadEnvByKey } from '../../src/config/loadEnv';

describe('loadEnv', () => {
  const mockProcessEnv = {
    a: '1',
    b: '2',
    c: '3',
    NODE_ENV: process.env.NODE_ENV,
  };

  beforeAll(() => {
    process.env = mockProcessEnv;
  });

  describe('loadEnvByKey', () => {
    it('should yield a function that retrieve env var only by the given keys', () => {
      const testKeys = ['a', 'c'];
      const expectedResult = { a: '1', c: '3' };
      const resultFunc = loadEnvByKey(...testKeys);
      const result = resultFunc();
      expect(typeof resultFunc).toBe('function');
      expect(result).toEqual(expectedResult);
    });

    it('should yield a function that retrieve all env var with no given key', () => {
      const resultFunc = loadEnvByKey();
      const result = resultFunc();
      expect(typeof resultFunc).toBe('function');
      expect(result).toEqual(mockProcessEnv);
    });
  });

  describe('loadEnv', () => {
    it('should retrive all env vars', () => {
      const result = loadEnv();
      expect(result).toEqual(mockProcessEnv);
    });
  });
});
