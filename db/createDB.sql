CREATE DATABASE zeroexchange;

\connect zeroexchange;

CREATE TABLE orders(
  orderObj jsonb NOT NULL,
  tokenAddress char(42) NOT NULL
);
