const express        = require('express');
const bodyParser     = require('body-parser');
const methodOverride = require('method-override');
const passport       = require('passport');
const localStrategy  = require('passport-local');  
const session        = require('express-session');
const fileUpload     = require('express-fileupload');
const flash          = require('connect-flash');
const { ObjectID }   = require('mongodb');
const app            = express();

// Database
const { mongoose }   = require('./db/mongoose');
const { User }       = require('./models/user');
const { Category }   = require('./models/category')

// Requiring routes
var routes = require('./routes');

// file upload
app.use(fileUpload());
// Configure body parser
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// View engine
app.set('view engine', 'ejs');
// Set public folder
app.use(express.static('public'));
// Set method override
app.use(methodOverride('_method'));
// Flash notification
app.use(flash());
// Session configuration
app.use(session({
    secret: "that's cu lua again",
    resave: false,
    saveUninitialized: false
}));
// Passport configuration
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());
// fomat price
var formatPrice = (price) => {
    let result = price + ',';
    result = result.replace(/\d(?=(\d{3})+\,)/g, '$&.');
    result = result.replace(',', '');
    return result + ' VNĐ';
};
// format date
var formatDate = (id) => {
    let a;
    if (!id) {
        return '';
    } else if (ObjectID.isValid(id)) {
        a = new Date(ObjectID(id).getTimestamp());
    } else {
        a = new Date(id);
    }
    let year = a.getFullYear();
    let date = a.getDate();
    if ((date + "").length ===  1) {
        date = "0" + date;
    }
    let month = a.getMonth() + 1;
    if ((month + "").length === 1) {
        month = "0" + month;
    }
    let hours = a.getHours();
    if ((hours + "").length === 1) {
        hours = "0" + hours;
    } 
    let minutes = a.getMinutes();
    if ((minutes + "").length === 1) {
        minutes = "0" + minutes;
    } 
    let seconds = a.getSeconds();
    if ((seconds + "").length === 1) {
        seconds = "0" + seconds;
    } 
    let time = `${date}-${month}-${year} ${hours}:${minutes}:${seconds}`;
    return time;
};
// Middleware to init user information
app.use((req, res, next) => {
    Category.find()
        .then(navCategory => {
            res.locals.formatDate        = formatDate;
            res.locals.formatPrice       = formatPrice;
            res.locals.currentUser       = req.user;
            res.locals.currentImportForm = req.session.currentImportForm;
            res.locals.cart              = req.session.cart;
            res.locals.error             = req.flash('error');
            res.locals.success           = req.flash('success');
            res.locals.navCategory       = navCategory;
            next();
        })
        .catch(err => {
            console.log(err);
            res.status(404).send("Not Found");
        })
    
});

// Routes
app.use('/', routes);

// Listening
const port = process.env.PORT || 8080;
app.listen(port, () => {
    console.log(`Servert started up on port ${port}`);
});
