/* var express = require('express');
var router = express.Router(); */
const { Client } = require('pg');

const client = new Client({
  "host": "localhost",
  "user": "root",
  "password": "12345",
  "database": "test",
  "max": 20
});
client.connect(err => {
  if (err) {
    console.error('connection error', err.stack);
    //throw err;
  } else {
    console.log('connected')
  }
})
module.exports = client;
