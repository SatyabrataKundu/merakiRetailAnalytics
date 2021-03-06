CREATE SEQUENCE Meraki.realtime_pos_data_key_seq;
CREATE TABLE meraki.realtime_pos_data
(
    unique_realtime_pos_data_key integer NOT NULL DEFAULT nextval('meraki.realtime_pos_data_key_seq'::regclass),
    no_of_items integer,
    total_amount integer,
    pos_counter_number integer,
    datetime bigint,
    dateformat_date character varying(12) COLLATE pg_catalog."default",
    dateformat_year integer DEFAULT 2019,
    dateformat_month integer,
    dateformat_week integer,
    dateformat_day integer,
    dateformat_hour integer,
    dateformat_minute integer,
    CONSTRAINT realtime_pos_data_pkey PRIMARY KEY (unique_realtime_pos_data_key)
)
WITH (
    OIDS = FALSE
)
TABLESPACE pg_default;

ALTER TABLE meraki.realtime_pos_data
    OWNER to postgres;