const express               = require('express');
const fs                    = require('fs-extra');
const _                     = require('lodash');
const { Product }           = require('./../../models/product');
const { ImportProductForm } = require('./../../models/import_products_form');

const router                = express.Router();

/*
 *  GET /new_import_form get import form
 */
router.get('/', (req, res) => {
    if (req.query.search) {
        const regex = new RegExp(escapeRegex(req.query.search), 'gi');
        Product.find({ title: regex }).then(products => {
            res.render('admin/new_import_form', { products });
        }, err => {
            console.log(err);
            res.redirect('back');
        });
    } else {
        Product.find()
            .then(products => res.render('admin/new_import_form', { products }))
            .catch(err => {
                console.log(err);
                res.redirect('back');
            });
    }
});

function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};

/*
 *  DELETE /new_import_form delete current import form 
 */
router.delete('/delete', (req, res) => {
    let products = req.session.currentImportForm;

    products = _.filter(products, { slug: 'new' });

    for (let i = 0; i < products.length; i++) {
        const product = products[i];
        let path = 'public/product_images/' + product._id;
        fs.remove(path)
            .then(() => {

            })
            .catch(err => {
                req.flash('error', 'Có lỗi xảy ra!');
                console.log(err)
                res.redirect('back');
            });
    }

    req.session.currentImportForm = [];

    req.flash('success', 'Bạn đã xóa đơn nhập thành công!');
    res.redirect('back');
});

/*
 *  DELETE /new_import_form/:id delete product in form
 */
router.delete('/:id', (req, res) => {
    let id = req.params.id;
    let path = 'public/product_images/' + id;
    let found = _.findIndex(req.session.currentImportForm, item => item._id == id);

    if (!req.session.currentImportForm[found].slug) {
        _.remove(req.session.currentImportForm, item => item._id == id);
        return res.redirect('back');
    }

    fs.remove(path)
        .then(() => {
            _.remove(req.session.currentImportForm, item => item._id == id);
            res.redirect('back');
        })
        .catch(err => {
            req.flash('error', 'Có lỗi xảy ra!');
            console.log(err)
            res.redirect('back');
        });
});

/*
 *  POST /new_import_form/:id add a product to form
 */
router.post('/:id', (req, res) => {
    Product.findById(req.params.id)
        .then(product => {
            let found = -1;
            found = _.findIndex(req.session.currentImportForm, item => item._id == product._id);
            if (found >= 0) {
                req.session.currentImportForm[found].quantity++;
            } else {
                product.quantity = 1;
                req.session.currentImportForm.push(product);
            }

            req.flash('success', `Đã thêm "${req.body.title}"`);
            res.redirect('back');
        })
        .catch(err => {
            console.log(err);
            res.redirect('back');
        })
});

/*
 *  PUT /new_import_form/:id edit product in form
 */
router.put('/:id', (req, res) => {
    let found = _.findIndex(req.session.currentImportForm, item => item._id == req.params.id);
    req.session.currentImportForm[found].quantity = req.body.quantity;

    res.redirect('back');
});

/*
 *  POST /new_import_form save import form 
 */
router.post('/', (req, res) => {
    if (req.session.currentImportForm.length === 0) {
        req.flash('error', 'Đơn hàng trống!');
        return res.redirect('back');
    }

    let data = {
        user: {
            id: req.user._id,
            username: req.user.username
        },
        listProducts: req.session.currentImportForm,
        totalQuantity: req.body.totalQuantity,
        totalPrice: req.body.totalPrice
    }

    let importForm = new ImportProductForm(data);

    importForm.save()
        .then((result) => {
            data.listProducts.forEach(product => {
                if (product.slug) {
                    let new_product = new Product(product);
                    new_product.slug = undefined;
                    new_product.save();
                } else {
                    Product.findById(product._id)
                        .then(result => {
                            result.price = product.price,
                                result.quantity += product.quantity
                            result.save();
                        });
                }
            });

            req.session.currentImportForm = [];
            req.flash('success', 'Bạn đã lưu đơn hàng thành công!');
            res.redirect('/admin/manage_product');

        })
        .catch(err => {
            req.flash('error', err.message);
            res.redirect('back');
        });
});

module.exports = router;