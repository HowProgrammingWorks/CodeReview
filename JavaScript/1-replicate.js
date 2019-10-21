'use strict';

// Implementation

const dup = (n, e) => {
  const a = new Array(n);
  for (let id = 0; id < n; id++) a[id] = e;
  return a;
};

// Tests

const assert = require('assert').strict;

const a = dup(3, 'hello');
const expected = ['hello', 'hello', 'hello'];
assert.deepEqual(a, expected);
