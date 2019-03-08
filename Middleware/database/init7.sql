-- Table: meraki.realtime_zones

-- DROP TABLE meraki.realtime_zones;

CREATE TABLE meraki.realtime_zones
(
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

CREATE TABLE meraki.realtime_mqtt_detections
(
    zone_id bigint,
    entrances integer,
    datetime bigint
)
WITH (
    OIDS = FALSE
)
TABLESPACE pg_default;

ALTER TABLE meraki.realtime_mqtt_detections
    OWNER to postgres;