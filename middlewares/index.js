// const { User } = require('./../models/user');
const { Feedback } = require('./../models/feedback');

var isLoggedIn = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }
    req.flash('error', 'Bạn phải đăng nhập để làm việc này!');
    res.redirect('/login');
}

var checkAdminAuth = (req, res, next) => {
    if (res.locals.currentUser.type === 1) {
        return next();
    }
    req.flash('error', 'Bạn không đủ quyền để làm việc này!');
    res.redirect('back');
}

var checkManagerAuth = (req, res, next) => {
    if (res.locals.currentUser.type <= 2) {
        return next();
    }
    req.flash('error', 'Bạn không đủ quyền để làm việc này!');
    res.redirect('back');
}

var checkFeedbackOwner = (req, res, next) => {
    if (req.isAuthenticated()) {
        Feedback.findById(req.params.id)
            .then(feedback => {
                if (feedback.author.equals(req.user._id)) {
                    next();
                } else {
                    req.flash('error', 'Bạn không thể sửa feedback này!');
                    res.redirect('back');
                }
            })
            .catch(err => {
                console.log(err);
                res.redirect('back');
            });
    } else {
        req.flash('error', 'Bạn phải đăng nhập để làm việc này!');
        res.redirect('/login');
    }
}

var checkFeedbackDelete = (req, res, next) => {
    if (req.isAuthenticated()) {
        Feedback.findById(req.params.id)
            .then(feedback => {
                if (feedback.author.equals(req.user._id) || req.user.type == 1) {
                    next();
                } else {
                    req.flash('error', 'Bạn không thể xóa feedback này!');
                    res.redirect('back');
                }
            })
            .catch(err => {
                console.log(err);
                res.redirect('back');
            });
    } else {
        req.flash('error', 'Bạn phải đăng nhập để làm việc này!');
        res.redirect('/login');
    }
}

var checkUserInfo = (req, res, next) => {
    if (req.isAuthenticated()) {
        if ((req.params.id == req.user._id)) {
            next();
        } else {
            req.flash('error', 'Bạn không thể truy cập tới profile này!');
            res.redirect('back');
        }
    } else {
        req.flash('error', 'Bạn phải đăng nhập để làm việc này!');
        res.redirect('/login');
    }
};

module.exports = {
    isLoggedIn,
    checkAdminAuth,
    checkManagerAuth,
    checkFeedbackOwner,
    checkFeedbackDelete,
    checkUserInfo
}