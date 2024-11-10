CREATE OR REPLACE FUNCTION check_duplicate_flight()
RETURNS TRIGGER AS $$
BEGIN
    IF EXISTS (
        SELECT 1
        FROM flights
        WHERE route_id = NEW.route_id
          AND departure_time = NEW.departure_time
          AND day_of_week = NEW.day_of_week
    ) THEN
        RAISE EXCEPTION 'Error: Duplicate flight. A flight with route_id %, departure_time %, and day_of_week % already exists.',
            NEW.route_id, NEW.departure_time, NEW.day_of_week;
    END IF;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql;
