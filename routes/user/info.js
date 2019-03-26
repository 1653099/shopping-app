const express = require('express');
const { User } = require('./../../models/user');
const { Cart } = require('./../../models/cart')
// const { checkUserInfo } = require('./../../middlewares');

const router = express.Router();

/*
 *  GET / xem thong tin tai khoan 
 */
router.get('/', (req, res) => {
    res.render('user/info');
});

/*
 *  GET /changepassword doi mat khau 
 */
router.get('/changepassword', (req, res) => {
    res.render('user/changepassword');
});

/*
 *  PUT /changepassword doi mat khau 
 */
router.put('/changepassword', (req, res) => {
    let oldPassword = req.body.oldPassword;
    let newPassword = req.body.newPassword;
    let user = req.user;
    user.changePassword(oldPassword, newPassword, (err) => {
        if (err) {
            console.log(err);
            req.flash('error', 'Mật khẩu cũ không đúng!');
            return res.redirect('back');
        }
        user.save();
        req.flash('success', 'Thay đổi mật khẩu thành công!');
        res.redirect('/info');
    });
});

/*
 *  GET /edit sua thong tin tai khoan 
 */
router.get('/edit', (req, res) => {
    res.render('user/editinfo');
});

/*
 *  PUT /edit  
 */
router.put('/edit', (req, res) => {
    let data = req.body;
    let user = req.user;
    user.fullName = data.fullName;
    user.phoneNumber = data.phoneNumber;
    user.address = data.address;
    user.save()
        .then(() => {
            req.flash('success', 'Cập nhật thông tin thành công!');
            res.redirect('/info');
        })
        .catch(err => {
            console.log(err);
            res.redirect('back');
        })
})

/*
 *  GET /cart quan ly don hang
 */
router.get('/cart', (req, res) => {
    User.findOne({ username: req.user.username })
        .populate({
            path: 'listCart',
            model: 'Cart'
        })
        .then(user => {
            res.render('user/cart', { user });
        })
        .catch(err => {
            console.log(err);
            res.redirect('back');
        });
});

/*
 *  GET /:id xem chi tiet cart 
 */
router.get('/cart/:id', (req, res) => {
    Cart.findById(req.params.id)
        .then(myCart => {
            res.render('user/cart_detail', { myCart });
        })
        .catch(err => {
            console.log(err);
            res.redirect('back');
        });
})

module.exports = router;