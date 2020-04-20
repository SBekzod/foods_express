const express = require('express');
const bodyParser = require('body-parser');
var authenticate = require('../authenticate');

const Leaders = require('../models/leaders');

const leadersRouter = express.Router();
leadersRouter.use(bodyParser.json());

leadersRouter.route('/')
    .get((req, res, next) => {
        Leaders.find({})
            .then((leaders) => {
                res.statusCode = 200;
                res.setHeader('Content-type', 'application/json');
                res.json(leaders);
            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .post(authenticate.verifyUser, (req, res, next) => {
        if (req.user.admin === true) {
            Leaders.create(req.body)
                .then((leader) => {
                    console.log('Leader created', leader);
                    res.statusCode = 200;
                    res.setHeader('Content-type', 'application/json');
                    res.json(leader);
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
            Leaders.remove({})
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


leadersRouter.route('/:id')                   // DAVOMIGA YOZING!
    .get((req, res, next) => {
        Leaders.findById(req.params.id)
            .then((leader) => {
                res.statusCode = 200;
                res.setHeader('Content-type', 'application/json');
                res.json(leader);
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
            Leaders.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true })
                .then((leader) => {
                    res.statusCode = 200;
                    res.setHeader('Content-type', 'application/json');
                    res.json(leader);
                }, (err) => next(err))
                .catch((err) => next(err));
        } else {
            res.send('Only admins can adjust this page');
        }
    })
    .delete(authenticate.verifyUser, (req, res, next) => {
        if (req.user.admin === true) {
            Leaders.findByIdAndRemove(req.params.id)
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

module.exports = leadersRouter;