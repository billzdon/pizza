const { getId, applyConnection, average, inStatement, group } = require('./shared')

var store = {}

store.create = function(reviewData) {
  return applyConnection(null, (client) => {
    return client.query('insert into reviews (rating, description, restaurant_id, created_at) VALUES ($1::INTEGER, $2::TEXT, $3, now()) RETURNING id', [
      reviewData.rating,
      reviewData.description,
      reviewData.restaurant_id
    ])
    .then(getId)
  })
}

// plus some pagination
store.getAggregate = function(restaurantId, optionalClient) {
  return applyConnection(optionalClient, (client) => {
    return client.query('select r.rating, r.description, r.restaurant_id from reviews r where r.restaurant_id = $1 order by r.created_at DESC', [
      restaurantId
    ])
    .then(data => data.rows.map(store.parse))
  })
}

store.attach = function(restaurants, optionalClient) {
  if (restaurants.length == 0) return Promise.resolve([])
  const restaurantIds = restaurants.map(r => r.id)
  return applyConnection(optionalClient, (client) => {
    return client.query(`select r.id, r.rating, r.description, r.restaurant_id from reviews r where r.restaurant_id IN ${inStatement(restaurantIds)} GROUP BY r.id, r.restaurant_id order by r.created_at DESC`,
      restaurantIds
    )
    .then(store.parseMany)
    .then(reviews => restaurants.forEach(r => r.reviews = reviews[r.id] ))
    .then(res => restaurants.forEach(r => r.averageScore = average(r.reviews || [], 'score')))
    .then(res => restaurants)
  })
}

store.parseMany = function(results) {
  return group(results.rows.map(store.parse), 'restaurant_id')
}

store.parse = function(data) {
  return { rating: data.rating, description: data.description, restaurant_id: data.restaurant_id }
}

module.exports = store
