const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

var ProductSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        unique: true
    },
    slug: {
        type: String
    },
    desc: {
        type: String,
        required: true
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category"
    },
    price: {
        type: Number,
        required: true
    },
    quantity: {
        type: Number,
        required: true
    },
    image: String,
    feedbacks: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Feedback"
        }
    ]
});

ProductSchema.plugin(uniqueValidator);

var Product = mongoose.model('Product', ProductSchema);

module.exports = { Product };
