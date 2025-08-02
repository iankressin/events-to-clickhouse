CREATE TABLE IF NOT EXISTS Approval (
    block_number UInt32 CODEC (DoubleDelta, ZSTD),
    timestamp DateTime CODEC (DoubleDelta, ZSTD),
    owner LowCardinality(FixedString(20)),
	spender LowCardinality(FixedString(20)),
	amount UInt256,
    sign Int8 DEFAULT 1,
)
ENGINE = CollapsingMergeTree()
ORDER BY (block_number, timestamp)

CREATE TABLE IF NOT EXISTS DelegateChanged (
    block_number UInt32 CODEC (DoubleDelta, ZSTD),
    timestamp DateTime CODEC (DoubleDelta, ZSTD),
    delegator LowCardinality(FixedString(20)),
	fromDelegate LowCardinality(FixedString(20)),
	toDelegate LowCardinality(FixedString(20)),
    sign Int8 DEFAULT 1,
)
ENGINE = CollapsingMergeTree()
ORDER BY (block_number, timestamp)

CREATE TABLE IF NOT EXISTS DelegateVotesChanged (
    block_number UInt32 CODEC (DoubleDelta, ZSTD),
    timestamp DateTime CODEC (DoubleDelta, ZSTD),
    delegate LowCardinality(FixedString(20)),
	previousBalance UInt256,
	newBalance UInt256,
    sign Int8 DEFAULT 1,
)
ENGINE = CollapsingMergeTree()
ORDER BY (block_number, timestamp)

CREATE TABLE IF NOT EXISTS MinterChanged (
    block_number UInt32 CODEC (DoubleDelta, ZSTD),
    timestamp DateTime CODEC (DoubleDelta, ZSTD),
    minter LowCardinality(FixedString(20)),
	newMinter LowCardinality(FixedString(20)),
    sign Int8 DEFAULT 1,
)
ENGINE = CollapsingMergeTree()
ORDER BY (block_number, timestamp)

CREATE TABLE IF NOT EXISTS Transfer (
    block_number UInt32 CODEC (DoubleDelta, ZSTD),
    timestamp DateTime CODEC (DoubleDelta, ZSTD),
    from LowCardinality(FixedString(20)),
	to LowCardinality(FixedString(20)),
	amount UInt256,
    sign Int8 DEFAULT 1,
)
ENGINE = CollapsingMergeTree()
ORDER BY (block_number, timestamp)

