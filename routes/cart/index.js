const express     = require('express');
const _           = require('lodash');
const { Product } = require('./../../models/product');
const { User }    = require('./../../models/user');
const { Cart }    = require('./../../models/cart');

const router = express.Router();

/*
 *  GET / xem chi tiet gio hang
 */
router.get('/', (req, res) => {
    res.render('cart/detail');
});

/*
 *  GET /checkout man hinh thanh toan
 */
router.get('/checkout', (req, res) => {
    let data = {
        fullName: "",
        email: "",
        phoneNumber: "",
        address: ""
    }
    if (req.user) {
        User.findById(req.user._id)
            .then(user => {
                data.fullName = user.fullName;
                data.email = user.email;
                data.phoneNumber = user.phoneNumber;
                data.address = user.address;
                res.render('cart/checkout', { data });
            })
            .catch(err => {
                console.log(err);
                res.redirect('back');
            });
    } else {
        res.render('cart/checkout', { data });
    }
});

/*
 *  POST / them san pham vao gio 
 */
router.post('/', (req, res) => {
    let id = req.body.id;

    Product.findById(id)
        .then(product => {
            if (product.quantity === 0) {
                req.flash('error', 'Sẩm phẩm đã hết hàng!');
                return res.redirect('back');
            }
            let data = {
                id: product._id,
                title: product.title,
                quantity: 1,
                price: product.price,
                image: '/product_images/' + product._id + '/' + product.image
            };

            if (typeof req.session.cart == "undefined") {
                req.session.cart = [];
                req.session.cart.push(data);
            } else {
                let cart  = req.session.cart
                let found = _.findIndex(cart, item => item.id == id);
                
                if (found >= 0) {
                    cart[found].quantity++;
                } else {
                    cart.push(data);
                }
            }

            res.redirect('back');
        })
        .catch(err => {
            console.log(err);
            req.flash('error', 'Không thể thêm sản phẩm!');
            res.redirect('back');
        });
});

/*
 *  POST /:id cap nhat so luong thang trong cart 
 */
router.put('/:id', (req, res) => {
    let id = req.params.id;
    let cart = req.session.cart;
    let qty = req.body.quantity;
    let found = _.findIndex(cart, item => item.id == id);

    Product.findById(id)
        .then(product => {
            if (found >= 0 && qty <= product.quantity) {
                cart[found].quantity = req.body.quantity;
            } else {
                req.flash('error', 'Bạn đã nhập quá số lượng cho phép!');
            }
            res.redirect('back');
        })
        .catch(err => {
            console.log(err);
            req.flash('error', 'Xảy ra lỗi khi thay đổi số lượng hàng');
            res.redirect('back');
        })
});

/*
 *  DELETE /:id xoa mot item khoi gio hang 
 */
router.delete('/:id', (req, res) => {
    let cart = req.session.cart;
    let id = req.params.id;
    let found = _.findIndex(cart, item => item.id == id);

    if (found >= 0) {
        _.remove(cart, item => item.id == id);
    } else {
        req.flash('error', 'Sẩn phẩm không tồn tại trong giỏ!');
    }

    res.redirect('back');
});

/*
 *  POST /checkout xac nhan don hang 
 */
router.post('/checkout', (req, res) => {
    let data = req.body;
    let cart = req.session.cart;
    let newCart = new Cart({
        listItems: [],
        totalQuantity: data.totalQuantity,
        totalPrice: data.totalPrice,
        payment: data.payment,
        status: 'Đang xử lý',
        fullName: data.fullName,
        phoneNumber: data.phoneNumber,
        email: data.email,
        address: data.address,
        comment: data.comment
    });

    cart.forEach(item => {
        newCart.listItems.push({
            id: item.id,
            title: item.title,
            quantity: item.quantity,
            price: item.price
        });
    });

    if (req.user) {
        newCart.user = {
            id: req.user._id,
            username: req.user.username
        };
        req.user.listCart.unshift(newCart);
        req.user.save();
    }

    newCart.save()
        .then(result => {
            newCart.listItems.forEach(item => {
                Product.findById(item.id).then(product => {
                    product.quantity -= item.quantity;
                    product.save();
                });
            });
            req.session.cart = undefined;
            req.session.save();
            res.render('cart/confirm', { lastCartId: newCart._id })
        })
        .catch(err => {
            console.log(err);
        });
});



module.exports = router;