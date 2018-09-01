# pizza

Sample curls for api (change base url to necessary ip):


Create restaurant (returns id)\
curl --header "Content-Type: application/json"   --request POST   --data '{"name":"test", "menu":{"menu_items":[]}, "address":{"street_name_1": "7725", "street_name_2": "apt 7", "city":"Miami", "state": "FL", "zipcode":"33143"}}'   http://18.222.189.92:8080/api/v1/restaurants 


Create restaurant with menu (returns id)\
curl --header "Content-Type: application/json"   --request POST   --data '{"name":"test", "menu":{"menu_items":[{"description":"burger", "price":4.33, "name":"cheeseburger"}]}, "address":{"street_name_1": "7725", "street_name_2": "apt 7", "city":"Miami", "state": "FL", "zipcode":"33143"}}'   http://18.222.189.92:8080/api/v1/restaurants 


Get restaurant with attached reviews/rating-score/menu\
curl --header "Content-Type: application/json"   --request GET   http://18.222.189.92:8080/api/v1/restaurants/35853a46-5df4-4db8-94dc-a2c0cc82ea7b 


Create Review\
curl --header "Content-Type: application/json"   --request POST   --data '{"description":"great", "rating":5.0, "restaurant_id":"35853a46-5df4-4db8-94dc-a2c0cc82ea7b"}'   http://18.222.189.92:8080/api/v1/reviews 


Get Reviews\
curl --header "Content-Type: application/json"   --request GET   http://18.222.189.92:8080/api/v1/restaurants/35853a46-5df4-4db8-94dc-a2c0cc82ea7b/reviews 


Find by address (can be anything in USA)\
curl --header "Content-Type: application/json"   --request GET   http://18.222.189.92:8080/api/v1/restaurants?address=Miami 

For address find, it uses geocode.xyz api to get lat/lng and then pg query to match closest places.

Setup:\
Need postgres and uuid extension.\
create extension if not exists "uuid-ossp";\
Need .env file for database info\
Sample:\
DB_USERNAME=node\
DB_PASSWORD=password\
DB_NAME=pizza\
Add database.json\
Sample:\
{
  "dev": {
  	"driver": "postgres",
  	"user": "node",
  	"password": "password",
  	"host": "localhost",
  	"database": "pizza",
		"multipleStatements": true
	},
	"sql-file" : true
}\
Run db-migrate up after creating db (to install db-migrate: create extension if not exists "uuid-ossp";)

Todo, more setup notes

Project is built with node & express
