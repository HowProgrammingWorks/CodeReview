'use strict';

const DURATION_UNITS = {
  days:    { rx: /(\d+)\s*d/, mul: 86400 },
  hours:   { rx: /(\d+)\s*h/, mul: 3600 },
  minutes: { rx: /(\d+)\s*m/, mul: 60 },
  seconds: { rx: /(\d+)\s*s/, mul: 1 }
};

// Parse duration string to seconds
// Example: duration('1d 10h 7m 13s')
const duration = s => {
  if (typeof(s) === 'number') return s;
  let result = 0;
  let unit, match, key;
  if (typeof(s) === 'string') {
    for (key in DURATION_UNITS) {
      unit = DURATION_UNITS[key];
      match = s.match(unit.rx);
      if (match) result += parseInt(match[1], 10) * unit.mul;
    }
  }
  return result * 1000;
};

// Convert bytes: Number to size: String with nearest units: Kb, Mb, Gb...
const bytesToSize = bytes => {
  if (bytes === 0) return '0';
  const i = parseInt(Math.floor(Math.log(bytes) / Math.log(1000)), 10);
  return (
    Math.round(bytes / Math.pow(1000, i), 2) +
    bytesToSize.sizes[i]
  );
};

bytesToSize.sizes = [
  '', ' Kb', ' Mb', ' Gb', ' Tb', ' Pb', ' Eb', ' Zb', ' Yb'
];

// Parse units and convert size: String to bytes: Number
const sizeToBytes = size => {
  if (typeof(size) === 'number') return size;
  size = size.toUpperCase();
  let result = 0;
  const units = sizeToBytes.units;
  if (typeof(size) === 'string') {
    let key, unit, match;
    let found = false;
    for (key in units) {
      unit = units[key];
      match = size.match(unit.rx);
      if (match) {
        result += parseInt(match[1], 10) * Math.pow(10, unit.pow);
        found = true;
      }
    }
    if (!found) result = parseInt(size, 10);
  }
  return result;
};

sizeToBytes.units = {
  yb: { rx: /(\d+)\s*YB/, pow: 24 },
  zb: { rx: /(\d+)\s*ZB/, pow: 21 },
  eb: { rx: /(\d+)\s*EB/, pow: 18 },
  pb: { rx: /(\d+)\s*PB/, pow: 15 },
  tb: { rx: /(\d+)\s*TB/, pow: 12 },
  gb: { rx: /(\d+)\s*GB/, pow: 9 },
  mb: { rx: /(\d+)\s*MB/, pow: 6 },
  kb: { rx: /(\d+)\s*KB/, pow: 3 }
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