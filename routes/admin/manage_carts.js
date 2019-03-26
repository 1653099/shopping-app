const express     = require('express');
const { Cart }    = require('./../../models/cart');
const { Product } = require('./../../models/product');

const router = express.Router();

/*
 *  GET / tat cat cart 
 */
router.get('/', (req, res) => {
    let query = {};
    if (req.query.search) {
        if (req.query.mode == 1) {
            const regex = new RegExp(escapeRegex(req.query.search), 'gi');
            query.fullName = regex;
        } else {
            query._id = req.query.search;
        }
    }
    Cart.find(query)
        .sort({ '_id': -1 })
        .then(carts => {
            res.render('admin/manage_carts', { carts });
        })
        .catch(err => {
            console.log(err);
            res.redirect('back');
        })
});

function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};

/*
 *  GET /new tat cat cart 
 */
router.get('/new', (req, res) => {
    Cart.find({ status: 'Đang xử lý' })
        .sort({ '_id': -1 })
        .then(carts => {
            res.render('admin/manage_carts', { carts });
        })
        .catch(err => {
            console.log(err);
            res.redirect('back');
        })
});

/*
 *   GET /:id chi tiet cart
 */
router.get('/:id', (req, res) => {
    Cart.findById(req.params.id)
        .then(cart => {
            res.render('admin/manage_carts_detail', { cart });
        })
        .catch(err => {
            console.log(err);
            res.redirect('back');
        })
});

/* 
 *  PUT /:id xac nhan don hang 
 */
router.put('/:id', (req, res) => {
    let date = new Date(req.body.date);
    Cart.findById(req.params.id)
        .then(cart => {
            cart.status = "Đã xử lý";
            cart.deliveryDate = date;
            cart.save();
            // req.flash('error', '')
            res.redirect('/admin/manage_carts/new');
        })
        .catch(err => {
            console.log(err);
            res.redirect('back');
        });
});

/*
 *  DELETE /:id huy don hang 
 */
router.delete('/:id', (req, res) => {
    Cart.findById(req.params.id)
        .then(cart => {
            if (cart.status === "Đã xử lý") {
                cart.save();
                return res.redirect('/admin/manage_carts/new');
            }
            cart.status = "Đã hủy";
            cart.listItems.forEach(item => {
                Product.findById(item.id)
                    .then(product => {
                        product.quantity += item.quantity;
                        product.save();
                    });
            });
            cart.save();
            // req.flash
            res.redirect('/admin/manage_carts/new');
        })
        .catch(err => {
            console.log(err);
            res.redirect('back');
        });
});

module.exports = router;