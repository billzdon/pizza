const { getId, applyConnection } = require('./shared')
const request = require('request');

var store = {}

store.create = function(addressData, optionalClient) {
  return applyConnection(optionalClient, (client) => {
    return client.query('insert into addresses (street_name_1, street_name_2, city, state, zipcode, latitude, longitude, created_at) VALUES ($1, $2, $3, $4, $5, $6, $7, now()) RETURNING id', [
      addressData.street_name_1,
      addressData.street_name_2,
      addressData.city,
      addressData.state,
      addressData.zipcode,
      addressData.latitude,
      addressData.longitude
    ]).then(getId)
  })
}

const geocodeUrl = 'https://geocode.xyz/'

store.geocode = function(address) {
  const escapedAddress = encodeURIComponent(`${address.street_name_1} ${address.street_name_2} ${address.city}, ${address.state} ${address.zipcode} USA`)
  const url = `${geocodeUrl}${escapedAddress}?json=1`
  return new Promise(function(resolve, reject) {
    return request(url, function (error, response, body) {
       if (!error && response.statusCode == 200) {
        const parsed = JSON.parse(body)
        return resolve({latitude: parsed.latt, longitude: parsed.longt})
      } else {
        return reject(error)
      }
    })
  })
}

module.exports = store
