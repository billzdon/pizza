const pool = require('../config/database.js')

function isFunction(functionToCheck) {
 return functionToCheck && {}.toString.call(functionToCheck) === '[object Function]';
}

module.exports = {
  getId: (res) => res.rows[0].id,
  applyConnection: function(client, next) {
    if (client) {
      return next(client)
    } else {
      return pool.connect().then(client => {
        return next(client)
        .then(res => {
          client.release();
          return res
        })
        .catch(e => {
          console.error('query error', e.message, e.stack)
        })
      })
    }
  },
  average: (arr, field) => arr.length == 0 ? 0 : arr.reduce( ( p, c ) => p + c[field], 0 ) / arr.length,
  inStatement: (ids) => `(${ids.map((id, index) => "$" + (index + 1)).join(', ')})`,
  group: function(list, prop) {
    return list.reduce(function(grouped, item) {
        var key = isFunction(prop) ? prop.apply(this, [item]) : item[prop];
        grouped[key] = grouped[key] || [];
        grouped[key].push(item);
        return grouped;
    }, {})
  }
}
