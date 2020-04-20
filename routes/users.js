var express = require('express');
var bodyParser = require('body-parser');
var passport = require('passport');
var authenticate = require('../authenticate');

const User = require('../models/user');

var router = express.Router();
router.use(bodyParser.json());

router.get('/', authenticate.verifyUser, (req, res, next) => {
  if (req.user.admin === true) {
    User.find({})
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

router.post('/signup', (req, res, next) => {
  User.register(new User({ username: req.body.username }),
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

router.post('/login', passport.authenticate('local'), (req, res) => {
  var token = authenticate.getToken({ _id: req.user._id });
  res.statusCode = 200;
  res.setHeader('Content-Type', 'application/json');
  res.json({ success: true, token: token, status: 'You are successfully logged in!' });
});

router.get('/logout', (req, res, next) => {
  if (req.session) {
    req.session.destroy();
    res.clearCookie('session-id');
    res.redirect('/');
  }
  else {
    var err = new Error('You are not logged in!');
    err.status = 403;
    next(err);
  }
});


module.exports = router;
