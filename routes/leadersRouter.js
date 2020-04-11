const express = require('express');
const bodyParser = require('body-parser');

const leadersRouter = express.Router();
leadersRouter.use(bodyParser.json());
leadersRouter.route('/')
    .all((req, res, next) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'text/plain');
        next();
    })
    .get((req, res, next) => {
        res.end('Will send all the leaders to you!');
    })
    .post((req, res, next) => {
        res.end('Will add the leaders: ' + req.body.name +
            ' and leader details: ' + req.body.description);
    })
    .put((req, res, next) => {
        res.statusCode = 403;
        res.end('Put operation does not make sense');
    })
    .delete((req, res, next) => {
        res.end('Deleting all the leaders');
    });


leadersRouter.route('/:id')                   // DAVOMIGA YOZING!
    .get((req, res, next) => {
        res.end('Will send the information about leaders'
            + req.params.id + ' to you!');
    })
    .post((req, res, next) => {
        res.statusCode = 403;
        res.end('Post operation does not make sense'
            + req.params.id);
    })
    .put((req, res, next) => {                       
        res.write('Updating the leader: ' + req.params.id);
        res.end(' Will update the leader: ' + req.body.name +
            ' with details: ' + req.body.description);
    })
    .delete((req, res, next) => {
        res.end('Deleting the chosen leader: ' + req.params.id);
    });

module.exports = leadersRouter;