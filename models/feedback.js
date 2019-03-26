const mongoose = require('mongoose');

var FeedbackSchema = mongoose.Schema({
    text: String,
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }
});

var Feedback = mongoose.model('Feedback', FeedbackSchema);

module.exports = { Feedback };