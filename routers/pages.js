let express = require('express');
let session = require('express-session');
let route = express.Router();
let db = require('../database/config');



// home page

route.get('/', function(req, res) {
  res.render('home', {title: 'Home'});
});






// blogs page 
route.get('/blogs', function(req, res) {
  let bl;
  db.query("SELECT * FROM blogs", function (err, result, fields) {
    if (err) {
      throw err;
    } else {
      res.render('blogs', {title: 'Blogs', bl: result});
      

    }
    
  }); 
  
});



// products page 
route.get('/shop', function(req, res) {
  let products;
  db.query("SELECT * FROM products left join categories on categories.id=products.category", function (err, result, fields) {
    if (err) {
      throw err;
    } else {
      res.render('products', {title: 'Shop', products: result});
    }
  });
});

// products detail page
route.get('/product/:product', function(req, res) {
  let products;
  db.query("SELECT * FROM products left join categories on categories.id=products.category where pid='"+req.params.product+"'", function (err, result, fields) {
    if (err) {
      throw err;
    } else {
      res.render('product', {title: 'Product', products: result});
    }
  });
});






// addtocart page
route.get('/add-to-cart/:product', function(req, res) {
  let product = req.params.product.split("-")[1];
  let products = [];
  if(req.cookies.node_express_ecommerce) {
    products = req.cookies.node_express_ecommerce;
  }
  db.query("SELECT * FROM products left join categories on categories.id=products.category where pid='"+product+"'", function (err, result, fields) {
    if (err) {
      console.log(err)     
    } else {
      let flag = 0;
      products.forEach(item => {
        if(item.pid == product) {
          flag = 1;
        }
      });
      if(flag == 0) {
        products.push({
          pid: result[0].pid,
          title: result[0].title,
          name: result[0].name,
          price: result[0].price,
          picture: result[0].picture,
          qnt: 1
        });
      }
      res.cookie('node_express_ecommerce', products, {path:'/'});
      res.redirect('/cart');
    }
  });
});

route.get('/remove-from-cart/:index', function(req, res) {
  let products = req.cookies.node_express_ecommerce;
  let index = req.params.index.split("-")[1];
  products.splice(index, 1);
  res.cookie('node_express_ecommerce', products, {path:'/'});
  
  res.redirect('/cart');
});

route.get('/empty-cart', function(req, res) {
  let products = [];
  res.cookie('node_express_ecommerce', products, {path:'/'});
  res.redirect('/cart');
});

route.get('/cart', function(req, res) {
  let products = [];

  if(req.cookies.node_express_ecommerce) {
    res.render('cart', {title: 'Cart', products: req.cookies.node_express_ecommerce});
  } else {
    res.render('cart', {title: 'Cart', products: products});
  }
});

route.post('/update-cart', function(req, res) {
  let products = req.cookies.node_express_ecommerce;
  products.forEach(function(product, index) {
    product.qnt = req.body.qnt[index];
  });
  res.clearCookie('node_express_ecommerce', {path:'/'});
  res.cookie('node_express_ecommerce', products);
  res.redirect('/cart');
});

route.get('/checkout', function(req, res) {
  res.render('order', {title: 'Checkout'});
});








// about us page
route.get('/about', function(req, res) {
  res.render('about', {title: 'About'});
});

// contact us page
route.get('/contact', function(req, res) {
  res.render('contact', {title: 'Contact'});
});

module.exports = route;