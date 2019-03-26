const express      = require('express');
const _            = require('lodash');
const user         = require('./user');
const product      = require('./product');
const admin        = require('./admin');
const search       = require('./search');
const cart         = require('./cart');
const feedback     = require('./feedback');
const { Product }  = require('./../models/product');
const { Category } = require('./../models/category');
const middleware   = require('./../middlewares');

const router       = express.Router();

/*
 * GET / homepage
 */
router.get('/', (req, res) => {
    Category.find()
        .then(categories => {
            res.render('landing', { categories });
        })
        .catch(err => {
            console.log(err);
            res.status(404).send("<h1>Page not found</h1>");
        });
});

router.get('/category/products/:id', (req, res) => {
    Product.find({ category: req.params.id })
        .sort({ '_id': -1 })
        .limit(4)
        .then((products => {
            res.send(products);
        }));    
});

/*
 *  GET /category/:id 
 */
router.get('/category/:id', (req, res) => {
    let id = req.params.id;
    Product.find({ category: id })
        .then(products => {
            res.render('category', { products, id });
        })
        .catch(err => {
            console.log(err);
        });
});

router.use('/', user);
router.use('/search', search);
router.use('/product', product);
router.use('/admin', middleware.isLoggedIn, middleware.checkManagerAuth, admin);
router.use('/cart', cart);
router.use('/feedback', feedback);

module.exports = router;
