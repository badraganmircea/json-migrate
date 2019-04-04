const mutateUtils = require('../utils');

describe('utils test suite', () => {
  it('createInBetweenVersionsArr', () => {
    expect(mutateUtils.createInBetweenVersionsArr(2, 5)).toEqual([2, 3, 4, 5]);
  })
});
