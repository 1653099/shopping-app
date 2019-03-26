const express      = require('express');
const fs           = require('fs-extra');
const { Product }  = require('./../../models/product');
const { Category } = require('./../../models/category');

const router = express.Router();

/*
 *  GET /product 
 */
router.get('/:id', (req, res) => {
    Product.findById(req.params.id)
        .populate('category')
        .populate({
            path: 'feedbacks',
            populate: {
                path: 'author',
            }
        })
        .then((product) => {
            if (!product) {
                return res.redirect('back');
            }

            let galleryDir = 'public/product_images/' + product._id + '/gallery';

            fs.readdir(galleryDir, (err, galleryImages) => {
                if (err) {
                    console.log(err);
                    return res.redirect('back');
                }

                res.render('product/show', { product, galleryImages });
            });
        })
        .catch((err) => {
            console.log(err);
            res.redirect('back');
        });
});

module.exports = router;