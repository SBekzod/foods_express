const express = require('express');
const bodyParser = require('body-parser');
var authenticate = require('../authenticate');
const cors = require('./cors');

const DishesModel = require('../models/dishes');

const dishRouter = express.Router();
dishRouter.use(bodyParser.json());
dishRouter.route('/')
    .options(cors.corsWithOptions, (req, res) => res.sendStatus = 200)
    .get(cors.cors, (req, res, next) => {
        DishesModel.find({})
            .then((DishesModel) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(DishesModel);
            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        res.statusCode = 403;
        res.end('Put operation does not make sense');
    })
    .post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        if (req.user.admin === true) {
            DishesModel.create(req.body)
                .then((dish) => {
                    console.log('Dish created', dish);
                    res.statusCode = 200;
                    res.setHeader('Content-type', 'application/json');
                    res.json(dish);
                }, (err) => next(err))
                .catch((err) => next(err));
        } else {
            res.send('Only admins can adjust this page');
        }
    })
    .delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        if (req.user.admin === true) {
            DishesModel.remove({})
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


dishRouter.route('/:id')                   // DAVOMIGA YOZING!
    .options(cors.corsWithOptions, (req, res) => res.sendStatus = 200)
    .get(cors.cors, (req, res, next) => {
        DishesModel.findById(req.params.id)
            .then((dish) => {
                res.statusCode = 200;
                res.setHeader('Content-type', 'application/json');
                res.json(dish);
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
            DishesModel.findByIdAndUpdate(req.params.id, { $set: req.body }, { new: true })
                .then((dish) => {
                    res.statusCode = 200;
                    res.setHeader('Content-type', 'application/json');
                    res.json(dish);
                }, (err) => next(err))
                .catch((err) => next(err));
        } else {
            res.send('Only admins can adjust this page');
        }
    })
    .delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        if (req.user.admin === true) {
            DishesModel.findByIdAndRemove(req.params.id)
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




dishRouter.route('/:dishId/comments')
    .options(cors.corsWithOptions, (req, res) => res.sendStatus = 200)
    .get(cors.cors, (req, res, next) => {
        DishesModel.findById(req.params.dishId)
            .then((dish) => {
                if (dish != null) {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(dish.comments);
                }
                else {
                    err = new Error('Dish ' + req.params.dishId + ' not found');
                    err.status = 404;
                    return next(err);
                }
            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {                    /// Any user can Post
        DishesModel.findById(req.params.dishId)
            .then((dish) => {
                if (dish != null) {
                    dish.comments.push(req.body);
                    dish.save()
                        .then((dish) => {
                            res.statusCode = 200;
                            res.setHeader('Content-Type', 'application/json');
                            res.json(dish);
                        }, (err) => next(err));
                }
                else {
                    err = new Error('Dish ' + req.params.dishId + ' not found');
                    err.status = 404;
                    return next(err);
                }
            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        res.statusCode = 403;
        res.end('PUT operation not supported on /DishesModel/'
            + req.params.dishId + '/comments');
    })
    .delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        if (req.user.admin === true) {
            DishesModel.findById(req.params.dishId)
                .then((dish) => {
                    if (dish != null) {
                        for (var i = (dish.comments.length - 1); i >= 0; i--) {
                            dish.comments.id(dish.comments[i]._id).remove();
                        }
                        dish.save()
                            .then((dish) => {
                                res.statusCode = 200;
                                res.setHeader('Content-Type', 'application/json');
                                res.json(dish);
                            }, (err) => next(err));
                    }
                    else {
                        err = new Error('Dish ' + req.params.dishId + ' not found');
                        err.status = 404;
                        return next(err);
                    }
                }, (err) => next(err))
                .catch((err) => next(err));
        } else {
            res.send('Only admins can adjust this page');
        }

    });

dishRouter.route('/:dishId/comments/:commentId')
    .options(cors.corsWithOptions, (req, res) => res.sendStatus = 200)
    .get(cors.cors, (req, res, next) => {
        DishesModel.findById(req.params.dishId)
            .then((dish) => {
                if (dish != null && dish.comments.id(req.params.commentId) != null) {
                    res.statusCode = 200;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(dish.comments.id(req.params.commentId));
                }
                else if (dish == null) {
                    err = new Error('Dish ' + req.params.dishId + ' not found');
                    err.status = 404;
                    return next(err);
                }
                else {
                    err = new Error('Comment ' + req.params.commentId + ' not found');
                    err.status = 404;
                    return next(err);
                }
            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        res.statusCode = 403;
        res.end('POST operation not supported on /DishesModel/' + req.params.dishId
            + '/comments/' + req.params.commentId);
    })
    .put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        DishesModel.findById(req.params.dishId)
            .then((dish) => {
                if (dish != null && dish.comments.id(req.params.commentId) != null
                    && dish.comments.id(req.params.commentId).author === req.user.username) {   // Is User comment's Author?
                    if (req.body.rating) {
                        dish.comments.id(req.params.commentId).rating = req.body.rating;
                    }
                    if (req.body.comment) {
                        dish.comments.id(req.params.commentId).comment = req.body.comment;
                    }
                    dish.save()
                        .then((dish) => {
                            res.statusCode = 200;
                            res.setHeader('Content-Type', 'application/json');
                            res.json(dish);
                        }, (err) => next(err));
                }
                else if (dish == null) {
                    err = new Error('Dish ' + req.params.dishId + ' not found');
                    err.status = 404;
                    return next(err);
                }
                else if (dish.comments.id(req.params.commentId).author !== req.user.username) {
                    res.send("You do not have right to change others' comments ");
                }
                else {
                    err = new Error('Comment ' + req.params.commentId + ' not found');
                    err.status = 404;
                    return next(err);
                }
            }, (err) => next(err))
            .catch((err) => next(err));
    })
    .delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        DishesModel.findById(req.params.dishId)
            .then((dish) => {
                if (dish != null && dish.comments.id(req.params.commentId) != null
                    && dish.comments.id(req.params.commentId).author === req.user.username) {   // Is User comment's Author?
                    dish.comments.id(req.params.commentId).remove();
                    dish.save()
                        .then((dish) => {
                            res.statusCode = 200;
                            res.setHeader('Content-Type', 'application/json');
                            res.json(dish);
                        }, (err) => next(err));
                }
                else if (dish == null) {
                    err = new Error('Dish ' + req.params.dishId + ' not found');
                    err.status = 404;
                    return next(err);
                }
                else if (dish.comments.id(req.params.commentId).author !== req.user.username) {
                    res.send("You do not have right to change others' comments ");
                }
                else {
                    err = new Error('Comment ' + req.params.commentId + ' not found');
                    err.status = 404;
                    return next(err);
                }
            }, (err) => next(err))
            .catch((err) => next(err));
    });



module.exports = dishRouter;