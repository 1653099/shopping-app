const mongoose = require('mongoose');
// const mongooseIntlPhoneNumber = require('mongoose-intl-phone-number');

var CartSchema = new mongoose.Schema({
    user: {
        id: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        username: String
    },
    listItems: [
        {
            id: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Product"
            },
            title: String,
            quantity: Number,
            price: Number
        }
    ],
    totalQuantity: Number,
    totalPrice: Number,
    deliveryDate: Date,
    payment: Number, //0-cod, 1-chuyen khoan
    status: String, 
    fullName: String,
    address: String,
    phoneNumber: String,
    email: String,
    comment: String
});

// CartSchema.plugin(mongooseIntlPhoneNumber, {
//     hook: 'validate',
//     phoneNumberField: 'phoneNumber'
// });

var Cart = mongoose.model('Cart', CartSchema);

module.exports = { Cart };
