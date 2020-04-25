const express = require('express');
const bodyparser = require('body-parser');
const authenticate = require('../authenticate');
const cors = require('./cors');

const CommentsModel = require('../models/comments');

const commentRouter = express.Router();
commentRouter.use(bodyparser.json());
commentRouter.route('/')
.options(cors.corsWithOptions, (req, res) => res.sendStatus = 200)
.get(cors.cors, (req, res, next) => {
    CommentsModel.find({})
        .then((comments) => {
            res.statusCode = 200;
            res.setHeader('Content-type', 'application/json');
            res.json(comments);
        }, (err) => next(err))
        .catch((err) => next(err));
})
.post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    if (req.user.admin === true) {
        CommentsModel.create(req.body)
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
.put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 403;
    res.end('Put operation does not make sense');
})
.delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    if (req.user.admin === true) {
        CommentsModel.remove({})
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


commentRouter.route('/:id')                   // DAVOMIGA YOZING!
.options(cors.corsWithOptions, (req, res) => res.sendStatus = 200)
.get((req, res, next) => {
    CommentsModel.findById(req.params.id)
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
        CommentsModel.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true })
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
        CommentsModel.findByIdAndRemove(req.params.id)
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

module.exports = commentRouter;