const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const authenticate = require('../authenticate');
const cors = require('./cors');

const favorites = require('../models/favorite');

const favoriteRouter = express.Router();

favoriteRouter.use(bodyParser.json());

favoriteRouter.route('/')
.options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
.get(cors.cors, authenticate.verifyUser, (req, res, next) => {
    favorites.findOne({ user: req.user._id })
    .populate('user')
    .populate('dishes')
    .then((item) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(item);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    console.log('find favorites for user ' + req.user._id, req.body.length);
    favorites.findOne({ user: req.user_id })
    .then((favorite) => {
        if (!favorite) {
            favorite = new favorites({ user: req.user._id, dishes: new Array() });
        }
        req.body.forEach((dish) => {
            console.log('insert favorite for new dish: ' + dish._id);
            if (favorite.dishes.indexOf(dish._id) === -1) {
                favorite.dishes.push(dish._id);
            }
        });
        console.log('favorites: ', favorite);
        favorite.save().then((favorite) => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(favorite);
        }, (err) => next(err));
    }, (err) => next(err))
    .catch((err) => next(err));
})
.put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /favorites');
})
.delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, net) => {
    favorites.remove({ user: req.user._id })
    .then((resp) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(resp);
    }, (err) => next(err))
    .catch((err) => next(err));
});

favoriteRouter.route('/:dishId')
.options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
.get(cors.cors, authenticate.verifyUser, (req, res, next) => {
    favorites.findOne({ user: req.user._id })
    .then((favorite) => {
        var result = { favorite: false, dishId: req.params.dishId }
        if (favorite) {
            if (favorite.dishes.indexOf(req.params.dishId) !== -1) {
                result.favorite = true;
            }
        }
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(result);
    }, (err) => next(err))
    .catch((err) => next(err));
})
.post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    favorites.findOne({ user: req.user._id })
    .then((favorite) => {
        if (!favorite) {
            favorite = new favorites({ user: req.user._id, dishes: new Array() });
        }
        if (favorite.dishes.indexOf(req.params.dishId) === -1) {
            favorite.dishes.push(req.params.dishId);
        }
        favorite.save().then((favorite) => {
            res.statusCode = 200;
            res.setHeader('Content-Type', 'application/json');
            res.json(favorite);
        }, (err) => next(err))
        .catch((err) => next(err));
    })
})
.put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 403;
    res.end('PUT operation not supported on /favorites/ ' + req.params.dishId);
})
.delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    favorites.findOne({ user: req.user._id })
    .then((favorite) => {
        if (favorite) {
            var i = favorite.dishes.indexOf(req.params.dishId);
            if (i !== -1) {
                favoriteRouter.dishes.splice(i, 1);
            }
            favorite.save().then((favorite) => {
                res.statusCode = 200;
                res.setHeader('Content-Type', 'application/json');
                res.json(favorite);
            }, (err) => next(err)); 
        }
    }, (err) => next(err))
    .catch((err) => next(err));
});

module.exports = favoriteRouter;