

CREATE TABLE meraki.realtime_zones
(
    zone_name character varying(80) COLLATE pg_catalog."default",
    zone_id bigint
)
WITH (
    OIDS = FALSE
)
TABLESPACE pg_default;

ALTER TABLE meraki.realtime_zones
    OWNER to postgres;


insert into meraki.realtime_zones (zone_id, zone_name) values (668784544664518704, 'Checkout1');
insert into meraki.realtime_zones (zone_id, zone_name) values (668784544664518706, 'Grocery');
insert into meraki.realtime_zones (zone_id, zone_name) values (668784544664518707, 'Checkout2');
insert into meraki.realtime_zones (zone_id, zone_name) values (668784544664518708, 'Waiting');
insert into meraki.realtime_zones (zone_id, zone_name) values (668784544664518705, 'Apparel');
insert into meraki.realtime_zones (zone_id, zone_name) values (668784544664518709, 'Kids');
insert into meraki.realtime_zones (zone_id, zone_name) values (668784544664518711, 'Entrance');
insert into meraki.realtime_zones (zone_id, zone_name) values (0, 'Full Frame');


-- Table: meraki.realtime_mqtt_detections

-- DROP TABLE meraki.realtime_mqtt_detections;
CREATE SEQUENCE meraki.mqtt_detections_key_seq;

CREATE TABLE meraki.realtime_mqtt_detections
(
    unique_mqtt_detection_key integer NOT NULL DEFAULT nextval('meraki.mqtt_detections_key_seq'::regclass),
    zone_id bigint,
    entrances integer,
    datetime bigint,
    dateformat_date character varying(12) COLLATE pg_catalog."default",
	dateformat_year integer DEFAULT 2019,
    dateformat_month integer,
    dateformat_week integer,
    dateformat_day integer,
    dateformat_hour integer,
    dateformat_minute integer
)
WITH (
    OIDS = FALSE
)
TABLESPACE pg_default;

ALTER TABLE meraki.realtime_mqtt_detections
    OWNER to postgres;