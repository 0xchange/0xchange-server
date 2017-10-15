CREATE DATABASE zeroexchange;

\connect zeroexchange;

CREATE TABLE orders(
  orderObj jsonb NOT NULL,
  makerFee varchar(64),
  makerTokenAddress char(42) NOT NULL,
  makerTokenAmount varchar(64),
  takerFee varchar(64),
  takerTokenAddress char(42) NOT NULL,
  takerTokenAmount varchar(64)
);

CREATE TABLE tokens(
  address char(42) PRIMARY KEY,
  symbol varchar(45),
  token_name varchar(45),
  decimals bigint
);
