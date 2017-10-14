CREATE DATABASE zeroexchange;

\connect zeroexchange;

CREATE TABLE orders(
  orderObj jsonb NOT NULL,
  makerToken char(42) NOT NULL,
  takerToken char(42) NOT NULL
);
