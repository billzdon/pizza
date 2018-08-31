# pizza

Sample curls for api:


Create restaurant (returns id)\
curl --header "Content-Type: application/json"   --request POST   --data '{"name":"test", "menu":{"menu_items":[]}, "address":{"street_name_1": "7725", "street_name_2": "apt 7", "city":"Miami", "state": "FL", "zipcode":"33143"}}'   http://localhost:8080/api/v1/restaurants 


Create restaurant with menu (returns id)\
curl --header "Content-Type: application/json"   --request POST   --data '{"name":"test", "menu":{"menu_items":[{"description":"burger", "price":4.33, "name":"cheeseburger"}]}, "address":{"street_name_1": "7725", "street_name_2": "apt 7", "city":"Miami", "state": "FL", "zipcode":"33143"}}'   http://localhost:8080/api/v1/restaurants 


Get restaurant with attached reviews/rating-score/menu\
curl --header "Content-Type: application/json"   --request GET   http://localhost:8080/api/v1/restaurants/d4c4e76d-c37a-4969-bd63-ed27ad374793 


Create Review\
curl --header "Content-Type: application/json"   --request POST   --data '{"description":"great", "rating":5.0, "restaurant_id":"d4c4e76d-c37a-4969-bd63-ed27ad374793"}'   http://localhost:8080/api/v1/reviews 


Get Reviews\
curl --header "Content-Type: application/json"   --request GET   http://localhost:8080/api/v1/restaurants/d4c4e76d-c37a-4969-bd63-ed27ad374793/reviews 


Find by address (can be anything in USA)\
curl --header "Content-Type: application/json"   --request GET   http://localhost:8080/api/v1/restaurants?address=Miami 

For address find, it uses geocode.xyz api to get lat/lng and then pg query to match closest places.

Setup:
Need postgres and uuid extension.\
Need .env file for database info\
Sample:\
DB_USERNAME=node\
DB_PASSWORD=password\
DB_NAME=pizza

Todo, more setup notes

Project is built with node & express
