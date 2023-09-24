'use strict';

// Implementation

const between = (str, quotes) => {
  const start = quotes[0];
  const end = quotes[1];
  let i = str.indexOf(start);
  if (i === -1) return '';
  const line = str.substring(i + 1);
  if (end) {
    i = line.indexOf(end);
    if (i === -1) return '';
    return line.substring(0, i);
  }
  return str;
};

// Tests

const assert = require('node:assert').strict;

{
  const line = 'Marcus Aurelius <marcus@spqr.re>';
  const email = between(line, '<>');
  const expected = 'marcus@spqr.re';
  assert.equal(email, expected);
}

{
  const line = 'Marcus Aurelius email is marcus@spqr.re';
  const email = between(line, '<>');
  const expected = '';
  assert.equal(email, expected);
}

{
  const line = 'Marcus Aurelius email is <>';
  const email = between(line, '<>');
  const expected = '';
  assert.equal(email, expected);
}

{
  const line = 'Marcus Aurelius >marcus@spqr.re<';
  const email = between(line, '<>');
  const expected = '';
  assert.equal(email, expected);
}
