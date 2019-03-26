const express      = require('express');
const { Category } = require('./../../models/category');
const { ObjectID } = require('mongodb');
const _            = require('lodash');

const router = express.Router();

/*
 *  GET / get manage category page 
 */
router.get('/', (req, res) => {
    Category.find().then(categories => {
        res.render('admin/manage_categories', { categories, ObjectID })
    }, err => {
        console.log(err);
        res.redirect('back');
    })
});

/*
 *  POST / add a category 
 */
router.post('/', (req, res) => {
    var author = {
        id: req.user.id,
        username: req.user.username
    }
    var category = new Category({ 
        title: req.body.title,
        author
    });

    category.save(function (err) {
        if (err) {
            console.log(err);
        }
        res.redirect('back');
    });
});

/* 
 *  PUT / edit a category
 */
router.put('/:id', (req, res) => {
    var id   = req.params.id;
    var body = _.pick(req.body, ['title']);

    if (!ObjectID.isValid(id)) {
        return res.status(400).send({});
    }

    Category.findByIdAndUpdate(id, { $set: body }, { new: true }).then(category => {
        if (!category) {
            return res.redirect('/admin/manage_categories');
        }

        res.redirect('/admin/manage_categories');
    }, err => {
        console.log(err);
        res.redirect('/admin/manage_categories');
    })
});

/* 
 *  DELETE / delete a category 
 */
router.delete('/:id', (req, res) => {
    Category.findByIdAndDelete(req.params.id, (err) => {
        if (err) {
            console.log(err);
        }
        res.redirect('back');
    });
});

module.exports = router;