const express = require('express');
const bodyParser = require('body-parser');

const promotionRouter = express.Router();
promotionRouter.use(bodyParser.json());
promotionRouter.route('/')
    .all((req, res, next) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/plain');
        next();
    })
    .get((req, res, next) => {
        res.end('Will send all the promotion to you!');
    })
    .post((req, res, next) => {
        res.end('Will add the promotion: ' + req.body.name +
            ' and promotion details: ' + req.body.description);
    })
    .put((req, res, next) => {
        res.statusCode = 403;
        res.end('Put operation does not make sense');
    })
    .delete((req, res, next) => {
        res.end('Deleting all the promotion');
    });


promotionRouter.route('/:id')                   // DAVOMIGA YOZING!
    .get((req, res, next) => {
        res.end('Will send the information about promotion'
            + req.params.id + ' to you!');
    })
    .post((req, res, next) => {
        res.statusCode = 403;
        res.end('Post operation does not make sense'
            + req.params.id);
    })
    .put((req, res, next) => {                       
        res.end(' Will update the promotion: ' + req.body.name +
            ' with details: ' + req.body.description);
    })
    .delete((req, res, next) => {
        res.end('Deleting the chosen promotion: ' + req.params.id);
    });

module.exports = promotionRouter;