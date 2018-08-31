const Address = require('./address')
const Menu = require('./menu')
const Review = require('./review')
const { getId, applyConnection, average, inStatement } = require('./shared')

var store = {}

store.create = function(restaurantData) {
  let createdAddressId
  return Address.geocode(restaurantData.address).then(geocodeData => {
    return applyConnection(null, (client) => {
      return Address.create({...restaurantData.address, ...geocodeData}, client)
      .then(addressId => {
        createdAddressId = addressId
        return Menu.create(restaurantData.menu, client)
      })
      .then(menuId => store.createAttributes({...restaurantData, ...{menu_id: menuId, address_id: createdAddressId}}, client))
    })
  })
}

store.all = function() {
  return applyConnection(null, (client) => {
    return client.query('select r.id, r.name, a.street_name_1, a.street_name_2, a.city, a.state, a.zipcode, r.menu_id from restaurants r JOIN addresses a ON a.id = r.address_id')
    .then(store.parseMany)
    .then(Menu.attach)
    .then(Review.attach)
  })
}

store.getClosest = function(location) {
  return Address.geocode(location).then(geocodeData => {
    return applyConnection(null, (client) => {
      return client.query('select r.id, (point(a.longitude, a.latitude) <@> point($1, $2)) as distance from restaurants r JOIN addresses a ON a.id = r.address_id ORDER BY distance limit 10', [geocodeData.longitude, geocodeData.latitude])
      .then(result => store.getMany(result.rows.map(r => r.id)), client)
    })
  })
}

// separate data querying and attachment from find logic, usually better speed and easier to modify in long run
store.getMany = function(ids, optionalClient) {
  return applyConnection(optionalClient, (client) => {
    return client.query('select r.id, r.name, a.street_name_1, a.street_name_2, a.city, a.state, a.zipcode, r.menu_id from restaurants r JOIN addresses a ON a.id = r.address_id where r.id IN ' + inStatement(ids), ids)
    .then(result => store.parseMany(result.rows))
    .then(Menu.attach)
    .then(Review.attach)
  })
}

store.createAttributes = function(attributes, optionalClient) {
  return applyConnection(optionalClient, (client) => {
    return client.query('insert into restaurants (name, menu_id, address_id, created_at) VALUES ($1, $2, $3, now()) RETURNING id', [
      attributes.name,
      attributes.menu_id,
      attributes.address_id
    ]).then(getId)
  })
}

store.get = function(id) {
  return applyConnection(null, (client) => {
    return client.query('select r.id, r.name, a.street_name_1, a.street_name_2, a.city, a.state, a.zipcode, r.menu_id from restaurants r JOIN addresses a ON a.id = r.address_id where r.id = $1 group by r.id, a.id', [
      id
    ])
    .then(result => store.parseMany(result.rows))
    .then(Menu.attach)
    .then(Review.attach)
    .then(restaurants => restaurants[0])
  })
}

store.parseMany = function(rows) {
  return rows.map(store.parse)
}

store.parse = function(data) {
  return {
    id: data.id,
    name: data.name,
    address: {
      street_name_1: data.street_name_1,
      street_name_2: data.street_name_2,
      city: data.city,
      state: data.state,
      zipcode: data.zipcode
    },
  }
}

module.exports = store
