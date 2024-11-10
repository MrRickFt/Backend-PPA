CREATE TRIGGER before_insert_flight
BEFORE INSERT ON flights
FOR EACH ROW
EXECUTE FUNCTION check_duplicate_flight();