create table counter (
  oid varchar(255) not null,
  counter_id varchar(255) not null,
  counter_type varchar(255) not null,
  start timestamptz not null,
  temporality varchar(20) default 'ALL_TIME',
  total bigint default null,
  primary key (oid),
  unique (counter_id, counter_type, start, temporality)
);