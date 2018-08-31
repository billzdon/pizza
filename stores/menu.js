const { getId, applyConnection, inStatement, group } = require('./shared')
const MenuItem = require('./menu_item')

var store = {}

store.create = function(menuData, optionalClient) {
  const menuName = menuData.name || 'Default Menu'
  return applyConnection(optionalClient, (client) => {
    return client.query('insert into menus (name, created_at) VALUES ($1, now()) RETURNING id', [
      menuName
    ])
    .then(getId)
    .then(menuId => {
      let results = MenuItem.createAll(client, menuData.menu_items, menuId)
      return menuId
    })
  })
}

store.get = function(id, optionalClient) {
  return applyConnection(optionalClient, (client) => {
    // left join to make sure we get empty menu back with name
    return client.query('select m.name as menu_name, mi.name, mi.description, mi.price from menus m left join menu_items mi on mi.menu_id = m.id where m.id = $1', [
      id
    ]).then(store.parse)
  })
}

store.getForRestaurant = function(restaurantId, optionalClient) {
  return applyConnection(optionalClient, (client) => {
    return client.query('select m.name as menu_name, mi.name, mi.description, mi.price from restaurants r inner join menus m on r.menu_id = m.id left join menu_items mi on mi.menu_id = m.id where r.id = $1', [
      restaurantId
    ]).then(store.parse)
  })
}

store.attach = function(restaurants, optionalClient) {
  if (restaurants.length == 0) return Promise.resolve([])
  const restaurantIds = restaurants.map(r => r.id)
  return applyConnection(optionalClient, (client) => {
    return client.query(`select m.id as menu_id, m.name as menu_name, mi.id, mi.name, mi.description, mi.price, r.id as restaurant_id from restaurants r inner join menus m on r.menu_id = m.id left join menu_items mi on mi.menu_id = m.id where r.id IN ${inStatement(restaurantIds)} GROUP BY r.id, m.id, mi.id`,
      restaurantIds
    )
    .then(store.parseMany)
    .then(menus => restaurants.map(r => { r.menu = menus[r.id] || {menu_items: []}; return r }))
  })
}

store.parse = function(results) {
  if (results.rows.length == 0) return null
  return { name: results.rows[0].menu_name, menu_items: results.rows.map(MenuItem.parse) }
}

store.parseMany = function(results) {
  let grouped = group(results.rows, 'menu_id')
  let menus = {}
  Object.keys(grouped).forEach((menuId) => {
    menus[grouped[menuId][0].restaurant_id] = { name: grouped[menuId][0].menu_name, menu_items: grouped[menuId].map(MenuItem.parse) }
  })
  return menus
}

module.exports = store
