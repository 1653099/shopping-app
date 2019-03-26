const express               = require('express');
const passport              = require('passport');
const info                  = require('./info');
const { isLoggedIn }        = require('./../../middlewares');
const { User }              = require('./../../models/user');
const { ImportProductForm } = require('./../../models/import_products_form');

const router = express.Router();

/*
 *   GET /register
 */
router.get('/register', (req, res) => {
    res.render('user/register');
});

/*
 *   POST /register
 */
router.post('/register', (req, res) => {
    User.register(new User({
        username: req.body.username,
        email   : req.body.email,
        fullName: '',
        phoneNumber: '',
        address: ''
    }), req.body.password, (err, user) => {
        if (err) {
            req.flash('error', err.message);
            return res.redirect('back');
        }
        passport.authenticate('local')(req, res, () => {
            req.flash('success', 'Bạn đã đăng ký thành công!');
            res.redirect('/');
        });
    });
});


/*
 *   GET /login
 */
router.get('/login', (req, res) => {
    res.render('user/login');
});

/*
 *   POST /login
 */
router.post('/login', passport.authenticate('local', {
    failureRedirect: '/login',
    failureFlash: true
}), (req, res) => {
    req.flash('success', 'Bạn đã đăng nhập thành công!');
    if (req.user.type <= 2) {
        req.session.currentImportForm = [];
        return res.redirect('/admin');
    }
    res.redirect('/');
});

/*
 *   GET /logout
 */
router.get('/logout', function (req, res) {
    req.session.cart = undefined;
    req.logout();
    // req.flash('success', 'YOU HAVE LOGGED OUT!');
    req.session.save((err) => {
        if (err) {
            console.log(err);
        } else {
            req.flash('success', 'Bạn đã đăng xuất thành công!');
            req.session.currentImportForm = null;
            res.redirect('/');
        }
    });
});

/* thong tin tai khoan */
router.use('/info', isLoggedIn, info);

module.exports = router;
