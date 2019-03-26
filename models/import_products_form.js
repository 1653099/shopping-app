const mongoose = require('mongoose');

var importProductSchema = new mongoose.Schema({
    user: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String
    },
    listProducts: [
        {
            id: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Products"
            },
            title: String,
            quantity: Number,
            price: Number
        }
    ],
    totalQuantity: Number,
    totalPrice: Number
});

var ImportProductForm = mongoose.model('ImportProductForm', importProductSchema); 

module.exports = { ImportProductForm };
