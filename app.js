const express = require('express');
const ejs = require("ejs");
const bodyParser = require('body-parser');
const sass = require('node-sass');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const session = require('express-session');
const flash = require('connect-flash');

const db = require("./config/db.js");
const User = require('./model/user');
const Product = require('./model/product');

const app = express();

let cart = [];

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.use(session({
    secret: 'secret key',
    resave: false,
    saveUninitialized: false
}));

app.use(flash());

db.connect();

//passport
app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy({ usernameField: 'email' }, (email, password, done) => {
	User.findOne({ email: email })
		.then((user) => {
			if (!user) {
				return done(null, false, { message: 'Incorrect email.' });
			}
			if (user.password !== password) {
				return done(null, false, { message: 'Incorrect password.' });
			}
			return done(null, user);
		})
		.catch((err) => done(err));
}));

passport.serializeUser((user, done) => {
	done(null, user.id);
});

passport.deserializeUser((id, done) => {
    User.findById(id)
        .then((user) => {
            done(null, user);
        })
        .catch((err) => {
            done(err, null);
        });
});

//product
const products = [
    {
      id: 1,
      name: 'Donut',
      price: 30,
      category: 'bakery',
      detail: 'Freshly baked donut topped with your choice of glaze and sprinkles.',
      image: '/images/product-img/donut.jpg'
    },
    {
      id: 2,
      name: 'Soft drink',
      price: 20,
      category: 'beverage',
      detail: 'Refreshing soft drink in your choice of flavor, served over ice.',
      image: '/images/product-img/soft-drink.jpg'
    },
    {
      id: 3,
      name: 'Fish burger',
      price: 60,
      category: 'burger',
      detail: 'Crispy battered fish fillet served on a toasted bun with tartar sauce and lettuce.',
      image: '/images/product-img/fish-burger.jpg'
    },
    {
      id: 4,
      name: 'Fried Chicken',
      price: 50,
      category: 'chicken',
      detail: 'Crispy fried chicken seasoned with our secret blend of spices and served with your choice of dipping sauce.',
      image: '/images/product-img/fried-chicken.jpg'
    },
    {
      id: 5,
      name: 'Pepperoni pizza',
      price: 40,
      category: 'pizza',
      detail: 'Classic pizza topped with mozzarella cheese, pepperoni slices, and tomato sauce.',
      image: '/images/product-img/pepperoni-pizza.jpg'
    }
];


// Sign Up
app.get('/sign_up', (req, res) => {
    res.render('sign_up');
});
app.post('/sign_up', (req, res) => {
	const { username, email, password } = req.body;
	const newUser = new User({
		username,
		email,
		password
	});
	newUser.save()
		.then(() => {
			res.redirect('/sign_in');
		})
		.catch((err) => {
			console.log(err);
			res.status(500).send('Error creating new user');
		});
});

// Sign In
app.get('/sign_in', (req, res) => {
    res.render('sign_in', { message: req.flash('error') });
});
app.post('/sign_in', passport.authenticate('local', {
    successRedirect: '/home',
    failureRedirect: '/sign_in',
    failureFlash: 'Invalid email or password'
}));

// Home
app.get("/home", async (req, res) => {
    try {
      if (req.user && req.user.email) {
        const user = await User.findOne({ email: req.user.email });
        const username = user.username;

        const products = await Product.find();

        res.render("home", { username: username, user: user, products: products });
        
      } else {
        res.redirect("/sign_in");
      }
    } catch (err) {
      console.error(err);
      res.status(500).send("Internal server error");
    }
});
// Cart
app.post('/add-to-cart/:id', (req, res) => {
    const productId = req.params.id;
  
    Product.findById(productId, (err, product) => {
      if (err) {
        console.error(err);
        return res.status(500).send('Error finding product');
      }
  
      cart.push({
        id: product.id,
        name: product.name,
        price: product.price,
        quantity: 1,
      });
  
      res.redirect('/home');
    });
  });
  
  app.get('/cart', (req, res) => {
    // Pass the cart object to the cart.ejs view
    res.render('cart', { cart });
  });
  
  // Update the cart
  app.post('/update-cart', (req, res) => {
    // Retrieve the cart data from the request body
    const cartData = req.body;
  
    // Update the cart object
    cart = cartData;
  
    // Redirect the user back to the cart page
    res.redirect('/cart');
  });


app.listen(3000, function() {
    console.log("Server started on port 3000");
});