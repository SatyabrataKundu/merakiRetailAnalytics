-- Table: meraki.realtime_checkoutzone_billingcounter_map

-- DROP TABLE meraki.realtime_checkoutzone_billingcounter_map;

CREATE TABLE meraki.realtime_checkoutzone_billingcounter_map
(
    zone_id bigint,
    pos_counter_number integer
)
WITH (
    OIDS = FALSE
)
TABLESPACE pg_default;

ALTER TABLE meraki.realtime_checkoutzone_billingcounter_map
    OWNER to postgres;


INSERT INTO meraki.realtime_checkoutzone_billingcounter_map(
	zone_id, pos_counter_number)
	VALUES (668784544664518758, 1);