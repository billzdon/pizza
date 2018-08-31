require('dotenv').config()
//require('babel-register');

const express = require('express')
const path = require('path')
const port = process.env.PORT || 8080
const app = express()
const bodyParser = require('body-parser')
const expressValidator = require('express-validator')

app.use(express.static(__dirname + '/public'))

//app.use(expressValidator);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var router = express.Router();

require('./routes/api.js')(router);
app.use('/api/v1', router);

app.listen(port)
console.log("server started on port " + port)
