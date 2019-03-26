const mongoose = require('mongoose');

mongoose.Promise = global.Promise;

var mlabURI = 'mongodb://group1:asdasd12@ds045137.mlab.com:45137/group1_shopping_app';
var localURI = 'mongodb://localhost:27017/ShoppingApp';
mongoose.connect(localURI, { 
    useNewUrlParser: true,
    useCreateIndex: true
 });

module.exports = {
    mongoose
};