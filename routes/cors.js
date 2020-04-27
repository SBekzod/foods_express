const express = require('express');
const cors = require('cors');

const whiteList = ['http://localhost:3001', 'https://localhost:3443', 'http://localhost:3000'];
var corsOptionsDelegate = (req, callback) => {
  var corsOptions;
  if (whiteList.indexOf(req.header('Origin')) !== -1) {
    corsOptions = { origin: true };
  } else {
    corsOptions = { origin: false };
  }
  callback(null, corsOptions);
};

module.exports.cors = cors();
module.exports.corsWithOptions = cors(corsOptionsDelegate);