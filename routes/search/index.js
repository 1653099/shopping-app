const express      = require('express');
const _            = require('lodash');
const { Product }  = require('./../../models/product');
const { Category } = require('./../../models/category');

const router       = express.Router();

/*
 * GET /products/auto_complete.json send auto_complete.json
 */
router.get('/products/auto_complete.json', (req, res) => {
    Product.find().then(products => {
        let titles = _.map(products, _.partialRight(_.pick, ['title']));
        res.send(titles);
    }, err => res.send(err));
});

/*
 *  GET / 
 */
router.get('/', (req, res) => {
    if (req.query.search) {
        const regex = new RegExp(escapeRegex(req.query.search), 'gi');
        Product.find({ title: regex }).then(products => {
            res.render('search', { products, query: req.query.search });
        }, err => {
            console.log(err);
            res.redirect('back');
        });
    } else {
        res.render('search', { products: [], query: '' });
    }
});

function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};

module.exports = router;