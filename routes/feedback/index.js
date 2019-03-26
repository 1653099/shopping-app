const express = require('express');
const middleware = require('./../../middlewares');
const { Feedback } = require('./../../models/feedback');
const { Product } = require('./../../models/product');

const router = express.Router();

/*
 *  POST / them feedback moi 
 */
router.post('/', middleware.isLoggedIn, (req, res) => {
    let feedback = new Feedback({
        text: req.body.comment,
        author: req.user._id
    });

    feedback.save()
        .then(result => {
            Product.findById(req.body.id)
                .then(product => {
                    product.feedbacks.unshift(feedback);
                    product.save()
                        .then(() => {
                            res.redirect('back');
                        })
                });
        })
        .catch(err => {
            console.log(err);
            res.redirect('back');
        });
});

/*
 *  PUT /:id sua feedback 
 */
router.put('/:id', middleware.checkFeedbackOwner, (req, res) => {
    Feedback.findById(req.params.id)
        .then(feedback => {
            feedback.text = req.body.text;
            feedback.save();
            res.redirect('back');
        })
        .catch(err => {
            console.log(err);
            res.redirect('back');
        })
});

/*
 *  DELETE /:id xoa feedback 
 */
router.delete('/:id', middleware.checkFeedbackDelete, (req, res) => {
    Feedback.findByIdAndDelete(req.params.id)
        .then(() => {
            res.redirect('back');
        })
        .catch(err => {
            console.log(err);
            res.redirect('back');
        })
});

module.exports = router;