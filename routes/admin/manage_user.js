const express  = require('express');
const { User } = require('./../../models/user');

const router = express.Router();

/*
 *  GET / render page show all users 
 */
router.get('/', (req, res) => {
    let query = {
        type: { $gte: 2 }
    };
    if (req.query.search) {
        const regex = new RegExp(escapeRegex(req.query.search), 'gi');
        query.username = regex;
    }
    User.find(query).then(users => {
        res.render('admin/manage_user', { users });
    }, err => {
        console.log(err);
        res.redirect('back');
    });
});

function escapeRegex(text) {
    return text.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
};

/*
 *  POST /change_type/:id change type of a user 
 */
router.put('/change_type/:id', (req, res) => {
    User.findByIdAndUpdate(req.params.id, { $set: { type: req.body.type } }).then(result => {
        res.redirect('back');
    }).catch(err => {
        req.flash('error', err.message);
        res.redirect('back');
    });
});

module.exports = router;