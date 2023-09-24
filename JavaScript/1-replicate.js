'use strict';

// Implementation

const duplicate = (count, e) => {
  const a = new Array(count);
  for (let id = 0; id < count; id++) a[id] = e;
  return a;
};

// Tests

const assert = require('node:assert').strict;

const a = duplicate(3, 'hello');
const expected = ['hello', 'hello', 'hello'];
assert.deepEqual(a, expected);
