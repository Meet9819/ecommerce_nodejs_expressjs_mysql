var express = require('express');
var session = require('express-session');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var morgan = require('morgan');
const mysql = require('mysql');
var app = express(); 

var path = require("path");




// passport includes login and registration query stuff
var passport = require('passport');
var flash = require('connect-flash');
require('./loginregisterconfig/passport')(passport);
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({
 extended: true
}));
//


var reload = require('reload');
app.set('port', process.env.POST || 7000);
app.set('view engine', 'ejs');
app.set('views', 'views');
app.use(cookieParser());




//
app.use(session({
 secret: 'justasecret',
 resave:true,
 saveUninitialized: true
}));
//


app.use(session({secret: 'kak'}));
var bodyParser = require('body-parser');
app.use(bodyParser.json()); 
app.use(bodyParser.urlencoded({ extended: true }));
app.locals.siteTitle = 'Ecommerce';

 
  app.use(express.static(path.join(__dirname, "public")));

  app.use(express.static(__dirname + '/public'));
  //app.use('/static', express.static(__dirname + '/public'));

// this folder includes all website UI page links
app.use(require('./routers/pages'));
// this folder includes all admin panel page links
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());
require('./adminapp/routes.js')(app, passport);
//





var server = app.listen(7000, function() {
  console.log('Running server');
})
reload(server, app); 
