CREATE TABLE addresses(
   id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
   street_name_1 varchar(255),
   street_name_2 varchar(255),
   city varchar(64),
   state varchar(2),
   zipcode varchar(5),
   latitude float,
   longitude float,
   created_at timestamp with time zone
);

CREATE TABLE menus(
   id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
   name varchar(64),
   created_at timestamp with time zone
);

CREATE TABLE menu_items(
   id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
   name varchar(64),
   description varchar(255),
   price float,
   created_at timestamp with time zone,
   menu_id uuid REFERENCES menus(id)
);

CREATE TABLE restaurants(
   id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
   name varchar(64),
   created_at timestamp with time zone,
   address_id uuid REFERENCES addresses(id),
   menu_id uuid REFERENCES menus(id)
);

CREATE TABLE reviews(
   id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
   rating int,
   description text,
   created_at timestamp with time zone,
   restaurant_id uuid REFERENCES restaurants(id)
);
