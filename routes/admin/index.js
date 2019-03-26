const express          = require('express');
const middleware       = require('./../../middlewares');
const manageUser       = require('./manage_user');
const manageCarts      = require('./../admin/manage_carts');
const manageProducts   = require('./../admin/manage_products');
const manageCategories = require('./manage_categories');
const viewRevenue      = require('./../admin/view_revenue');

const router = express.Router();

/*
 * GET / admin main page
 */
router.get('/', (req, res) => {
    res.render('admin/index');
});

router.use('/manage_user', middleware.checkAdminAuth, manageUser);
router.use('/manage_product', manageProducts);
router.use('/manage_carts', manageCarts);
router.use('/manage_categories', middleware.checkAdminAuth, manageCategories);
router.use('/view_revenue', middleware.checkAdminAuth, viewRevenue);

module.exports = router;