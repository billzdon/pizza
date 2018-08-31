const {applyConnection, getId} = require('./shared')

var store = {}

store.create = function(menuItemData, optionalClient) {
  return applyConnection(optionalClient, (client) => {
    return client.query('insert into menu_items (menu_id, name, description, price, created_at) VALUES ($1, $2, $3, $4, now()) RETURNING id', [
      menuItemData.menu_id,
      menuItemData.name,
      menuItemData.description,
      menuItemData.price
    ])
    .then(getId)
  })
}

store.createAll = function(client, menuItems, menuId) {
  const items = menuItems.map(item => { return {...item, ...{menu_id: menuId}} })
  return Promise.all(items.map(item => store.create(item, client)), res => res)
}

store.parse = function(data) {
  return { name: data.name, description: data.description, price: data.price }
}

module.exports = store
