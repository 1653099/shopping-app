const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

// Category Schema
var CategorySchema = mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
        unique: true
    },
    author: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String
    },
    slug: {
        type: String
    }
});

CategorySchema.plugin(uniqueValidator);

var Category = mongoose.model('Category', CategorySchema);

module.exports = { Category };
