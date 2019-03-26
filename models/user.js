const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');
// const mongooseIntlPhoneNumber = require('mongoose-intl-phone-number');

var UserSchema = new mongoose.Schema({
    username: {
        type: String,
        require: true,
        trim: true
    },
    password: {
        type: String,
        require: true
    },
    fullName: {
        type: String
    },
    email: {
        type: String,
        require: true
    },
    address: {
        type: String
    },
    phoneNumber: {
        type: String
    },
    type: {
        type: Number, //1-admin, 2-manager, 3-customer
        require: true,
        default: 3
    },
    listCart: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Cart'
        }
    ]
});

UserSchema.plugin(passportLocalMongoose);

// UserSchema.plugin(mongooseIntlPhoneNumber, {
//     hook: 'validate',
//     phoneNumberField: 'phoneNumber'
// });

var User = mongoose.model("User", UserSchema);

module.exports = { User };
