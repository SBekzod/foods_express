const express = require('express');
const bodyParser = require('body-parser');
var authenticate = require('../authenticate');

const Promotions = require('../models/promotions');

const promotionRouter = express.Router();
promotionRouter.use(bodyParser.json());
promotionRouter.route('/')
    .get((req, res, next) => {
        Promotions.find({})
            .then((promotions) => {
                res.statusCode = 200;
                res.setHeader('Content-type', 'application/json');
                res.json(promotions);
            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .post(authenticate.verifyUser, (req, res, next) => {
        if (req.user.admin === true) {
            Promotions.create(req.body)
                .then((promotion) => {
                    console.log('Promotion created', promotion);
                    res.statusCode = 200;
                    res.setHeader('Content-type', 'application/json');
                    res.json(promotion);
                }, (err) => next(err))
                .catch((err) => next(err));
        } else {
            res.send('Only admins can adjust this page');
        }
    })
    .put(authenticate.verifyUser, (req, res, next) => {
        res.statusCode = 403;
        res.end('Put operation does not make sense');
    })
    .delete(authenticate.verifyUser, (req, res, next) => {
        if (req.user.admin === true) {
            Promotions.remove({})
                .then((resp) => {
                    res.statusCode = 200;
                    res.setHeader('Content-type', 'application/json');
                    res.json(resp);
                }, (err) => next(err))
                .catch((err) => next(err));
        } else {
            res.send('Only admins can adjust this page');
        }
    });


promotionRouter.route('/:id')                   // DAVOMIGA YOZING!
    .get((req, res, next) => {
        Promotions.findById(req.params.id)
            .then((promotion) => {
                res.statusCode = 200;
                res.setHeader('Content-type', 'application/json');
                res.json(promotion);
            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .post(authenticate.verifyUser, (req, res, next) => {
        res.statusCode = 403;
        res.end('Post operation does not make sense'
            + req.params.id);
    })
    .put(authenticate.verifyUser, (req, res, next) => {
        if (req.user.admin === true) {
            Promotions.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true })
                .then((promotion) => {
                    res.statusCode = 200;
                    res.setHeader('Content-type', 'application/json');
                    res.json(promotion);
                }, (err) => next(err))
                .catch((err) => next(err));
        } else {
            res.send('Only admins can adjust this page');
        }

    })
    .delete(authenticate.verifyUser, (req, res, next) => {
        if (req.user.admin === true) {
            Promotions.findByIdAndRemove(req.params.id)
                .then((resp) => {
                    res.statusCode = 200;
                    res.setHeader('Content-type', 'application/json');
                    res.json(resp);
                }, (err) => next(err))
                .catch((err) => next(err));
        } else {
            res.send('Only admins can adjust this page');
        }

    });


module.exports = promotionRouter;