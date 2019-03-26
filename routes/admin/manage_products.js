const express               = require('express');
const mkdirp                = require('mkdirp');
const fs                    = require('fs-extra');
const { ObjectID }          = require('mongodb');
const newImportForm         = require('./new_import_form');
const { Product }           = require('./../../models/product');
const { Category }          = require('./../../models/category');
const { ImportProductForm } = require('./../../models/import_products_form');

const router = express.Router();

/*
 *  GET / get all products page 
 */
router.get('/', (req, res) => {
    let query = {}
    if (req.query.search) {
        const regex = new RegExp(escapeRegex(req.query.search), 'gi');
        query.title = regex
    } 
    if (req.query.category) {
        query.category = req.query.category;
    }
    Product.find(query)
        .sort('title')
        .populate('category')
        .then((products) => {
            res.render('admin/manage_products', { products, cate_id: '' });
        })
        .catch(err => {
            console.log(err);
            res.redirect('back');
        });
});

/*
 *  GET /:id get all products page by cate
 */
// router.get('/:id', (req, res) => {
//     if (req.query.search) {
//         const regex = new RegExp(escapeRegex(req.query.search), 'gi');
//         Product.find({ category: req.params.id, title: regex })
//             .sort('title')
//             .populate('category')
//             .then((products) => {
//                 res.render('admin/manage_products', { products, cate_id: req.params.id });
//             })
//             .catch(err => {
//                 console.log(err);
//                 res.redirect('back');
//             });
//     } else {
//         Product.find({ category: req.params.id})
//             .sort('title')
//             .populate('category')
//             .then((products) => {
//                 res.render('admin/manage_products', { products, cate_id: req.params.id });
//             })
//             .catch(err => {
//                 console.log(err);
//                 res.redirect('back');
//             });
//     }
// });

function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};

/*
 *  GET /add get add a new product page 
 */
router.get('/add', (req, res) => {
    fs.emptyDir('public/buffer_images')
        .then(() => {
            Category.find({}).then(categories => {
                res.render('product/add', { categories });
            });
        })
        .catch(err => {
            console.log(err);
            res.redirect('back');
        });
});

/*
 *  POST /gallery save gallery image to buffer folder
 */
router.post('/gallery', (req, res) => {
    let productImage = req.files.file;
    let path         = 'public/buffer_images/' + req.files.file.name;

    productImage.mv(path, (err) => {
        if (err) {
            console.log(err);
        }
    });

    res.sendStatus(200);
});

/*
 *  GET /gallery save gallery
 */
router.get('/gallery', (req, res) => {
    let galleryDir = 'public/buffer_images';

    fs.readdir(galleryDir, (err, files) => {
        if (err) {
            return console.log(err);
        }

        res.send(files);
    });
});

/*
 *  DELETE /gallery/delete delete gallery buffer
 */
router.delete('/gallery/delete/:image', (req, res) => {
    let galleryDir = `public/buffer_images/${req.params.image}`;

    fs.remove(galleryDir)
        .then(() => {
            res.redirect('back');
        })
        .catch(err => {
            console.log(err);
            res.redirect('back');
        });
});

/*
 *  POST /add add a new product 
 */
router.post('/add', (req, res) => {
    Product.findOne({ title: req.body.title })
        .then(_product => {
            if (_product) {
                req.flash('error', 'Sản phẩm đã tồn tại!');
                return res.redirect('back');
            }

            let data = {
                title: req.body.title,
                desc: req.body.desc,
                price: req.body.price,
                quantity: req.body.quantity,
                image: req.files.image.name,
                category: req.body.category,
                slug: 'new'
            };

            let images = req.body.images;
            let product = new Product(data);

            mkdirp('public/product_images/' + product._id + '/gallery', (err) => {
                if (err) {
                    console.log(err);
                }

                if (product.image !== "") {
                    let productImage = req.files.image;
                    let path = 'public/product_images/' + product._id + '/' + data.image;

                    productImage.mv(path, function (err) {
                        if (err) {
                            console.log(err);
                        }
                    });
                }
            });

            if (images.length > 1) {
                images.forEach(image => {
                    let srcPath = 'public/buffer_images/' + image;
                    let dstPath = 'public/product_images/' + product._id + '/gallery/' + image;

                    fs.moveSync(srcPath, dstPath);
                });
            }

            req.session.currentImportForm.push(product);

            req.flash('success', `Thêm sản phẩm "${product.title}" thành công!`);
            res.redirect('/admin/manage_product/new_import_form');
        })
        .catch(err => {
            console.log(err);
            res.redirect('back');
        });
});

/*
 *  PUT /edit_price/:id edit price of product 
 */
router.put('/edit_price/:id', (req, res) => {
    Product.findByIdAndUpdate(req.params.id, {
        $set: {
            price: req.body.price
        }
    }, (err, product) => {
        if (err) {
            console.log(err);
        }

        req.flash('success', `Giá của sản phẩm "${product.title}" đã được thay đổi!`);
        res.redirect('back');
    });
});

/*
 *  GET /edit/:id render edit product page 
 */
router.get('/edit/:id', (req, res) => {
    Product.findById(req.params.id).populate('category').exec((err, product) => {
        if (err) {
            console.log(err);
        }

        Category.find({}, (err, categories) => {
            if (err) {
                console.log(err);
            }

            res.render('product/edit', { product, categories });
        });
    });
});

/*
 *  PUT /edit/:id edit product
 */
router.put('/edit/:id', (req, res) => {
    Product.findById(req.params.id, (err, product) => {
        if (err) {
            return console.log(err);
        }

        product.title = req.body.title;
        product.desc = req.body.desc;
        product.price = req.body.price;
        product.category = req.body.category;

        let path = 'public/product_images/' + req.params.id;
        if (req.files.image) {
            fs.remove(path + '/' + product.image).then(() => {
                let productImage = req.files.image;
                productImage.mv(path + '/' + req.files.image.name, (err) => {
                    if (err) {
                        console.log(err);
                    }
                });
            }, (err) => {
                console.log(err);
            });
            product.image = req.files.image.name;
        }

        product.save().then((new_product) => {
            req.flash('success', `"${new_product.title}" đã được sửa!`);
            res.redirect('/admin/manage_product');
        }, (err) => console.log(err));
    });
});

/*
 *  DELETE /:id delete a product 
 */
router.delete('/:id', (req, res) => {
    let id = req.params.id;
    let path = 'public/product_images/' + id;

    fs.remove(path).then(() => {
        Product.findByIdAndDelete(req.params.id).then(product => {
            req.flash('success', `Đã xóa "${product.title}"!`);
            res.redirect('back');
        });
    }).catch(err => {
        req.flash('error', 'Có lỗi xảy ra!');
        console.log(err)
        res.redirect('back');
    });
});

/*
 *  import form 
 */
router.use('/new_import_form', newImportForm);

/*
 * GET /view_history_import 
 */
router.get('/view_history_import', (req, res) => {
    ImportProductForm.find()
        .sort({ '_id': -1 })
        .then(importForms => {
            res.render('admin/view_history_import', { importForms });
        })
        .catch(err => {
            console.log(err);
            res.redirect('back');
        })
});

/*
 *  GET /view_history_import/:id 
 */
router.get('/view_history_import/:id', (req, res) => {
    ImportProductForm.findById(req.params.id)
        .then(form => {
            if (!form) {
                req.flash('error', 'Đơn hàng đã bị xóa hoặc không tồn tại!');
                return res.redirect('back');
            }

            res.render('admin/view_detail_form', { form });
        })
        .catch(err => {
            console.log(err);
            res.redirect('back');
        })
});

module.exports = router;
