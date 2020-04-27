var express = require('express');
var bodyParser = require('body-parser');
var passport = require('passport');
var authenticate = require('../authenticate');
const cors = require('./cors');

const UsersModel = require('../models/user');

var userRouter = express.Router();
userRouter.use(bodyParser.json());

userRouter.options('*', cors.corsWithOptions, (req, res) => res.status = 200);

userRouter.get('/', cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
  if (req.user.admin === true) {
    UsersModel.find({})
      .then((users) => {
        res.statusCode = 200;
        res.setHeader('Content-type', 'application/json');
        res.json(users);
      }, (err) => next(err))
      .catch((err) => next(err));
  } else {
    res.send('Only admins can see this page');
  }
});

userRouter.post('/signup', cors.corsWithOptions, (req, res, next) => {
  UsersModel.register(new UsersModel({ username: req.body.username }),
    req.body.password, (err, user) => {
      if (err) {
        res.statusCode = 500;
        res.setHeader('Content-Type', 'application/json');
        res.json({ err: err });
      }
      else {
        passport.authenticate('local')(req, res, () => {
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          res.json({ success: true, status: 'Registration Successful!' });
        });
      }
    });
});

userRouter.post('/login', cors.corsWithOptions, passport.authenticate('local'), (req, res) => {
  var token = authenticate.getToken({ _id: req.user._id });
  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/json');
  res.json({ success: true, token: token, status: 'You are successfully logged in!' });
});


module.exports = userRouter;
