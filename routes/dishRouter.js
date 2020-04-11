const express = require('express');
const bodyParser = require('body-parser');

const dishRouter = express.Router();
dishRouter.use(bodyParser.json());
dishRouter.route('/')
    .all((req, res, next) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/plain');
        next();
    })
    .get((req, res, next) => {
        res.end('Will send all the dishes to you!');
    })
    .post((req, res, next) => {
        res.end('Will add the dishes: ' + req.body.name +
            ' and dish details: ' + req.body.description);
    })
    .put((req, res, next) => {
        res.statusCode = 403;
        res.end('Put operation does not make sense');
    })
    .delete((req, res, next) => {
        res.end('Deleting all the dishes');
    });


dishRouter.route('/:id')                   // DAVOMIGA YOZING!
    .get((req, res, next) => {
        res.end('Will send the information about dishes'
            + req.params.id + ' to you!');
    })
    .post((req, res, next) => {
        res.statusCode = 403;
        res.end('Post operation does not make sense'
            + req.params.id);
    })
    .put((req, res, next) => {
        res.write('Updating the dish: ' + req.params.id);
        res.end(' Will update the dish: ' + req.body.name +
            ' with details: ' + req.body.description);
    })
    .delete((req, res, next) => {
        res.end('Deleting the chosen dish: ' + req.params.id);
    });



module.exports = dishRouter;