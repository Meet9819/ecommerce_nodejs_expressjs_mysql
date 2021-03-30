module.exports = function(app, passport) {
    
    

    /**/
    var bodyParser = require('body-parser');
    const mysql = require('mysql');

    const fileUpload = require('express-fileupload');
    const path = require('path');
    const {getHomePage} = require('./blogsview'); //view.js
    const {addblogPage, addblog, deleteblog, editblog, editblogPage} = require('./blogs'); // player.js    
    let db = require('../database/config');
    global.db = db;
    app.use(bodyParser.json()); // parse form data client
    app.use(fileUpload()); // configure fileupload
    /**/

    /* */
    app.get('/admin/blogsview', getHomePage, isLoggedIn);
    app.get('/admin/blogsadd', addblogPage , isLoggedIn);
    app.get('/admin/blogsedit/:id', editblogPage , isLoggedIn);
    app.get('/admin/blogsdelete/:id', deleteblog);
    app.post('/admin/blogsadd', addblog , isLoggedIn);
    app.post('/admin/blogsedit/:id', editblog , isLoggedIn);
    /* */


    




    
    /**/
  
    const {getHomePagee} = require('./testimonialsview'); //view.js
    const {addtestimonialsPage, addtestimonials, deletetestimonials, edittestimonials, edittestimonialsPage} = require('./testimonials'); // player.js    
 
    /**/

    /* */
    app.get('/admin/testimonialsview', getHomePagee, isLoggedIn);
    app.get('/admin/testimonialsadd', addtestimonialsPage , isLoggedIn);
    app.get('/admin/testimonialsedit/:id', edittestimonialsPage , isLoggedIn);
    app.get('/admin/testimonialsdelete/:id', deletetestimonials);
    app.post('/admin/testimonialsadd', addtestimonials , isLoggedIn);
    app.post('/admin/testimonialsedit/:id', edittestimonials , isLoggedIn);
    /* */






    app.get('/admin', function(req, res){
        res.render('admin/login.ejs', {message:req.flash('loginMessage')});    
    });
   
    app.post('/admin/login', passport.authenticate('local-login', {
     successRedirect: '/admin/profile',
     failureRedirect: '/admin',
     failureFlash: true
    }),

    function(req, res){
        if(req.body.remember){
        req.session.cookie.maxAge = 1000 * 60 * 3;
        }else{
        req.session.cookie.expires = false;
        }
        res.redirect('/admin');
    });
   
    app.get('/admin/signup', function(req, res){
     res.render('admin/signup.ejs', {message: req.flash('signupMessage')});
    });
   
    app.post('/admin/signup', passport.authenticate('local-signup', {
     successRedirect: '/admin/profile',
     failureRedirect: '/admin/signup',
     failureFlash: true
    }));
   
    app.get('/admin/profile', isLoggedIn, function(req, res){
     res.render('admin/profile.ejs', {
      user:req.user
     });
    });
   
    app.get('/admin/logout', function(req,res){
     req.logout();
     res.redirect('/admin/');
    })  


    app.get('/admin/home', isLoggedIn, function(req, res){
        res.render('admin/home.ejs', {
         user:req.user
        });
       });


   };
   
   function isLoggedIn(req, res, next){
    if(req.isAuthenticated())
     return next();
   
    res.redirect('/admin/');
   }