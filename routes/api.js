const Restaurant = require('../stores/restaurant')
const Review = require('../stores/review')
const { check, validationResult } = require('express-validator/check')
const { ZIPCODES } = require('../constants/constants')

function handleValidationErrors(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  } else {
    return next()
  }
}

module.exports = function(router) {
  router.get('/restaurants', (req, res) => {
    (req.query.address ? Restaurant.getClosest(req.query.address) : Restaurant.all()).then(restaurants => res.json(restaurants))
  })

  router.post('/restaurants', [
    check('name').isLength({ min: 1 }),
    check('menu').exists(),
    check('menu.menu_items').exists(),
    check('address').exists(),
    check('address.street_name_1').exists(),
    check('address.city').exists(),
    check('address.state').isIn(ZIPCODES),
    check('address.zipcode').isPostalCode('US')
  ], (req, res) => {
    return handleValidationErrors(req, res, () => {
      Restaurant.create({
        name: req.body.name,
        menu: req.body.menu,
        address: req.body.address
      }).then(restaurant => res.json(restaurant))
    })
  })

  router.get('/restaurants/:id', (req, res) => {
    Restaurant.get(req.params.id).then(restaurant => res.json(restaurant))
  })

  router.get('/restaurants/:id/reviews', [
    check('id').isUUID()
  ], (req, res) => {
    return handleValidationErrors(req, res, () => {
      Review.getAggregate(req.params.id).then(reviews => res.json(reviews))
    })
  })

  router.get('/restaurants/:id/menu', [
    check('id').isUUID()
  ], (req, res) => {
    return handleValidationErrors(req, res, () => {
      Menu.getForRestaurant(req.params.id).then(menu => res.json(menu))
    })
  })

  router.post('/reviews', [
    check('description').isLength({ min: 2 }),
    check('rating').isInt(),
    check('restaurant_id').isUUID()
  ], (req, res) => {
    return handleValidationErrors(req, res, () => {
      Review.create({
        rating: req.body.rating,
        description: req.body.description,
        restaurant_id: req.body.restaurant_id
      }).then(review => res.json(review))
    })
  })
}
