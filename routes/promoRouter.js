const express = require('express');
const bodyParser = require('body-parser');
var authenticate = require('../authenticate');
const cors = require('./cors');

const PromotionsModel = require('../models/promotions');

const promotionRouter = express.Router();
promotionRouter.use(bodyParser.json());
promotionRouter.route('/')
    .options(cors.corsWithOptions, (req, res) => res.sendStatus = 200)
    .get(cors.cors, (req, res, next) => {
        PromotionsModel.find({})
            .then((PromotionsModel) => {
                res.statusCode = 200;
                res.setHeader('Content-type', 'application/json');
                res.json(PromotionsModel);
            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        if (req.user.admin === true) {
            PromotionsModel.create(req.body)
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
    .put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        res.statusCode = 403;
        res.end('Put operation does not make sense');
    })
    .delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        if (req.user.admin === true) {
            PromotionsModel.remove({})
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
    .options(cors.corsWithOptions, (req, res) => res.sendStatus = 200)
    .get(cors.cors, (req, res, next) => {
        PromotionsModel.findById(req.params.id)
            .then((promotion) => {
                res.statusCode = 200;
                res.setHeader('Content-type', 'application/json');
                res.json(promotion);
            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        res.statusCode = 403;
        res.end('Post operation does not make sense'
            + req.params.id);
    })
    .put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        if (req.user.admin === true) {
            PromotionsModel.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true })
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
    .delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        if (req.user.admin === true) {
            PromotionsModel.findByIdAndRemove(req.params.id)
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