seat_booking_setting
---------------------
id (PK)
shop_name
is_enabled

seat_booking_seat_type
-----------------------
id (PK)
type
title
color
price
shop_name (FK -> seat_booking_setting.shop_name)

seat_booking_time_slot
-----------------------
id (PK)
shop_name (FK -> seat_booking_setting.shop_name)
is_global
map_id (FK -> seat_booking_map.id)
start_time
end_time

seat_booking_map
-----------------
id (PK)
shop_name (FK -> seat_booking_setting.shop_name)
json

seat_booking_ticket
--------------------
id (PK)
customer_name
order_id
order_gid
map_id (FK -> seat_booking_map.id)
slot_id (FK -> seat_booking_time_slot.id)
info
status
