CREATE OR REPLACE FUNCTION public.get_flights(
	origin_param character varying,
	destination_param character varying,
	day_of_week_param integer)
    RETURNS TABLE(flight_id integer, origin character varying, destination character varying, departure_time time without time zone, arrival_time time without time zone, day_of_week integer, stops character varying[]) 
    LANGUAGE 'plpgsql'
    COST 100
    VOLATILE PARALLEL UNSAFE
    ROWS 1000

AS $BODY$
BEGIN
    RETURN QUERY 
    WITH Flights AS (
        SELECT 
            f.flight_id AS flight_id,
            r.route_id AS route_id,
            r.origin AS origin,
            r.destination AS destination,
            f.departure_time AS departure_time,
            f.arrival_time AS arrival_time,
            f.day_of_week AS day_of_week,
            r.is_direct AS is_direct
        FROM 
            flights f
        JOIN 
            routes r ON f.route_id = r.route_id
        WHERE 
            r.origin = origin_param
            AND r.destination = destination_param
            AND f.day_of_week = day_of_week_param
    ),
    DirectFlights AS (
        SELECT 
            f.flight_id AS flight_id,
            f.route_id AS route_id,
            f.origin AS origin,
            f.destination AS destination,
            f.departure_time AS departure_time,
            f.arrival_time AS arrival_time,
            f.day_of_week AS day_of_week,
            ARRAY[f.origin, f.destination] AS stops
        FROM 
            Flights f
        WHERE 
            f.is_direct = TRUE
    ), 
    FlightsWithStops AS (
        SELECT 
            f.flight_id AS flight_id,
            f.route_id AS route_id,
            f.origin AS origin,
            f.destination AS destination,
            f.departure_time AS departure_time,
            f.arrival_time AS arrival_time,
            f.day_of_week AS day_of_week,
            ARRAY_AGG(rl.origin ORDER BY rl.leg_order) || f.destination AS stops
        FROM 
            Flights f
        JOIN 
            route_legs rl ON f.route_id = rl.route_id
        WHERE 
            f.is_direct = FALSE
        GROUP BY 
            f.flight_id, f.route_id, f.origin, f.destination, f.departure_time, f.arrival_time, f.day_of_week
    )
    SELECT 
        d.flight_id,
        d.origin,
        d.destination,
        d.departure_time,
        d.arrival_time,
        d.day_of_week,
        d.stops
    FROM 
        DirectFlights d
    UNION ALL
    SELECT 
        s.flight_id,
        s.origin,
        s.destination,
        s.departure_time,
        s.arrival_time,
        s.day_of_week,
        s.stops
    FROM 
        FlightsWithStops s
    ORDER BY 
        departure_time;
END;
$BODY$;

ALTER FUNCTION public.get_flights(character varying, character varying, integer)
    OWNER TO postgres;