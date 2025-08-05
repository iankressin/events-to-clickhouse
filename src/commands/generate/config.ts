export const solidityToClickHouseTypes = {
  // Unsigned integers
  uint8: 'UInt8',
  uint16: 'UInt16',
  uint32: 'UInt32',
  uint64: 'UInt64',
  uint128: 'UInt128',
  uint256: 'UInt256',
  uint: 'UInt256',

  // Signed integers
  int8: 'Int8',
  int16: 'Int16',
  int32: 'Int32',
  int64: 'Int64',
  int128: 'Int128',
  int256: 'Int256',
  int: 'Int256',

  // Boolean
  bool: 'Bool',

  // Address (20 bytes)
  address: 'LowCardinality(FixedString(20))',

  // Fixed-size bytes
  bytes1: 'FixedString(1)',
  bytes2: 'FixedString(2)',
  bytes3: 'FixedString(3)',
  bytes4: 'FixedString(4)',
  bytes5: 'FixedString(5)',
  bytes6: 'FixedString(6)',
  bytes7: 'FixedString(7)',
  bytes8: 'FixedString(8)',
  bytes9: 'FixedString(9)',
  bytes10: 'FixedString(10)',
  bytes11: 'FixedString(11)',
  bytes12: 'FixedString(12)',
  bytes13: 'FixedString(13)',
  bytes14: 'FixedString(14)',
  bytes15: 'FixedString(15)',
  bytes16: 'FixedString(16)',
  bytes17: 'FixedString(17)',
  bytes18: 'FixedString(18)',
  bytes19: 'FixedString(19)',
  bytes20: 'FixedString(20)',
  bytes21: 'FixedString(21)',
  bytes22: 'FixedString(22)',
  bytes23: 'FixedString(23)',
  bytes24: 'FixedString(24)',
  bytes25: 'FixedString(25)',
  bytes26: 'FixedString(26)',
  bytes27: 'FixedString(27)',
  bytes28: 'FixedString(28)',
  bytes29: 'FixedString(29)',
  bytes30: 'FixedString(30)',
  bytes31: 'FixedString(31)',
  bytes32: 'FixedString(32)',

  // Dynamic types
  bytes: 'String',
  string: 'String',
} as const
