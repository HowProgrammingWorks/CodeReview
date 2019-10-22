'use strict';

const DURATION_UNITS = {
  d: 86400, // days
  h: 3600, // hours
  m: 60, // minutes
  s: 1, // seconds
};

// Parse duration string to seconds
// Example: duration('1d 10h 7m 13s')
const duration = s => {
  if (typeof s === 'number') return s;
  if (typeof s !== 'string') return 0;
  let result = 0;
  const parts = s.split(' ');
  for (const part of parts) {
    const unit = part.slice(-1);
    const value = parseInt(part.slice(0, -1));
    const mult = DURATION_UNITS[unit];
    if (!isNaN(value) && mult) result += value * mult;
  }
  return result * 1000;
};

const SIZE_UNITS = ['', ' Kb', ' Mb', ' Gb', ' Tb', ' Pb', ' Eb', ' Zb', ' Yb'];

// Convert bytes: Number to size: String with nearest units: Kb, Mb, Gb...
const bytesToSize = bytes => {
  if (bytes === 0) return '0';
  const exp = Math.floor(Math.log(bytes) / Math.log(1000));
  const size = bytes / 1000 ** exp;
  const short = Math.round(size, 2);
  const unit = SIZE_UNITS[exp];
  return short + unit;
};

const UNIT_SIZES = {
  yb: 24, // yottabyte
  zb: 21, // zettabyte
  eb: 18, // exabyte
  pb: 15, // petabyte
  tb: 12, // terabyte
  gb: 9, // gigabyte
  mb: 6, // megabyte
  kb: 3, // kilobyte
};

// Parse units and convert size: String to bytes: Number
const sizeToBytes = size => {
  if (typeof size === 'number') return size;
  const [num, unit] = size.toLowerCase().split(' ');
  const exp = UNIT_SIZES[unit];
  const value = parseInt(num, 10);
  if (!exp) return value;
  return value * 10 ** exp;
};

// Tests

const assert = require('assert').strict;

// Target: duration
{
  const cases = [
    ['1d', 86400000],
    ['2d', 172800000],
    ['10h', 36000000],
    ['7m', 420000],
    ['13s', 13000],
    ['2d 43s', 172843000],
    ['5d 17h 52m 1s', 496321000],
    ['1d 10h 7m 13s', 122833000],
    ['1s', 1000],
    [500, 500],
    [0, 0],
    ['', 0],
    ['15', 0],
    ['10q', 0],
    [null, 0],
    [undefined, 0],
  ];
  for (const [arg, expected] of cases) {
    const result = duration(arg);
    assert.equal(result, expected);
  }
}

// Target:  bytesToSize
{
  const cases = [
    [0, '0'],
    [1, '1'],
    [100, '100'],
    [999, '999'],
    [1000, '1 Kb'],
    [1023, '1 Kb'],
    [1024, '1 Kb'],
    [1025, '1 Kb'],
    [1111, '1 Kb'],
    [2222, '2 Kb'],
    [10000, '10 Kb'],
    [1000000, '1 Mb'],
    [100000000, '100 Mb'],
    [10000000000, '10 Gb'],
    [1000000000000, '1 Tb'],
    [100000000000000, '100 Tb'],
    [10000000000000000, '10 Pb'],
    [1000000000000000000, '1 Eb'],
    [100000000000000000000, '100 Eb'],
    [10000000000000000000000, '10 Zb'],
    [1000000000000000000000000, '1 Yb'],
  ];
  for (const [arg, expected] of cases) {
    const result = bytesToSize(arg);
    assert.equal(result, expected);
  }
}

// Target: sizeToBytes
{
  const cases = [
    ['', NaN],
    [0, 0],
    ['0', 0],
    ['1', 1],
    [512, 512],
    ['100', 100],
    ['999', 999],
    ['1 Kb', 1000],
    ['2 Kb', 2000],
    ['10 Kb', 10000],
    ['1 Mb', 1000000],
    ['100 Mb', 100000000],
    ['10 Gb', 10000000000],
    ['1 Tb', 1000000000000],
    ['100 Tb', 100000000000000],
    ['10 Pb', 10000000000000000],
    ['1 Eb', 1000000000000000000],
    ['100 Eb', 100000000000000000000],
    ['10 Zb', 10000000000000000000000],
    ['1 Yb', 1000000000000000000000000],
  ];
  for (const [arg, expected] of cases) {
    const result = sizeToBytes(arg);
    assert.equal(result, expected);
  }
}
