const express = require('express');
const ejs = require("ejs");
const bodyParser = require('body-parser');
const sass = require('node-sass');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const session = require('express-session');
const flash = require('connect-flash');

const { authentication } = require('./control/authen');

const db = require("./config/db.js");
const User = require('./model/user');
const Product = require('./model/product');
const OrderList = require('./model/order');

const app = express();

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
    successRedirect: '/',
    failureRedirect: '/sign_in',
    failureFlash: 'Invalid email or password'
}));

// Home
app.get("/", async (req, res) => {
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
// Food order
app.get('/food_order', async (req, res) => {
    try {
      if (req.user && req.user.email) {
        const user = await User.findOne({ email: req.user.email });
        const username = user.username;
  
        const products = await Product.find();
        const orders = req.user.order;
  
        res.render("food_order", { username: username, user: user, products: products, orders: orders });
        
      } else {
        res.redirect("/sign_in");
      }
    } catch (err) {
      console.error(err);
      res.status(500).send("Internal server error");
    }
  });
  
  app.post('/food_order', authentication, async (req, res) => {
    const { productId, quantity } = req.body;

    try {
        // Find the product by ID
        const product = await Product.findById(productId);

        // Create the order list item
        const orderListItem = new OrderList({
            product: product._id,
            quantity: quantity,
            price: product.price,
            state: 'Queue'
        });

        // Add the order list item to the user's cart
        req.user.order.push(orderListItem);
 
        // Save the user
        await req.user.save();

        res.status(200).send('Product added to cart successfully');
    } catch (error) {
        console.log(error);
        res.status(500).send('Error adding item to cart');
    }
});

// Menu
app.get('/menu', async (req, res) => {
    try {
      if (req.user && req.user.email) {
        const user = await User.findOne({ email: req.user.email });
        const username = user.username;
  
        const products = await Product.find();
        const orders = req.user.order;
  
        res.render("menu", { username: username, user: user, products: products, orders: orders });
        
      } else {
        res.redirect("/sign_in");
      }
    } catch (err) {
      console.error(err);
      res.status(500).send("Internal server error");
    }
  });

// Bakery
app.get('/bakery', async (req, res) => {
  try {
    if (req.user && req.user.email) {
      const user = await User.findOne({ email: req.user.email });
      const username = user.username;

      const products = await Product.find();
      const orders = req.user.order;

      res.render("bakery", { username: username, user: user, products: products, orders: orders });
      
    } else {
      res.redirect("/sign_in");
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal server error");
  }
});
// Donut
app.get('/donut', async (req, res) => {
  try {
    if (req.user && req.user.email) {
      const user = await User.findOne({ email: req.user.email });
      const username = user.username;

      const products = await Product.find();
      const orders = req.user.order;

      res.render("donut", { username: username, user: user, products: products, orders: orders });
      
    } else {
      res.redirect("/sign_in");
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal server error");
  }
});
// Burger
app.get('/burger', async (req, res) => {
  try {
    if (req.user && req.user.email) {
      const user = await User.findOne({ email: req.user.email });
      const username = user.username;

      const products = await Product.find();
      const orders = req.user.order;

      res.render("burger", { username: username, user: user, products: products, orders: orders });
      
    } else {
      res.redirect("/sign_in");
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal server error");
  }
});
// Fish-burger
app.get('/fish-burger', async (req, res) => {
  try {
    if (req.user && req.user.email) {
      const user = await User.findOne({ email: req.user.email });
      const username = user.username;

      const products = await Product.find();
      const orders = req.user.order;

      res.render("fish-burger", { username: username, user: user, products: products, orders: orders });
      
    } else {
      res.redirect("/sign_in");
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal server error");
  }
});

// Beverage
app.get('/beverage', async (req, res) => {
  try {
    if (req.user && req.user.email) {
      const user = await User.findOne({ email: req.user.email });
      const username = user.username;

      const products = await Product.find();
      const orders = req.user.order;

      res.render("beverage", { username: username, user: user, products: products, orders: orders });
      
    } else {
      res.redirect("/sign_in");
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal server error");
  }
});
// Soft-drink
app.get('/soft-drink', async (req, res) => {
  try {
    if (req.user && req.user.email) {
      const user = await User.findOne({ email: req.user.email });
      const username = user.username;

      const products = await Product.find();
      const orders = req.user.order;

      res.render("soft-drink", { username: username, user: user, products: products, orders: orders });
      
    } else {
      res.redirect("/sign_in");
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal server error");
  }
});

// Chicken
app.get('/chicken', async (req, res) => {
  try {
    if (req.user && req.user.email) {
      const user = await User.findOne({ email: req.user.email });
      const username = user.username;

      const products = await Product.find();
      const orders = req.user.order;

      res.render("chicken", { username: username, user: user, products: products, orders: orders });
      
    } else {
      res.redirect("/sign_in");
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal server error");
  }
});
// Fried Chicken
app.get('/fried-chicken', async (req, res) => {
  try {
    if (req.user && req.user.email) {
      const user = await User.findOne({ email: req.user.email });
      const username = user.username;

      const products = await Product.find();
      const orders = req.user.order;

      res.render("fried-chicken", { username: username, user: user, products: products, orders: orders });
      
    } else {
      res.redirect("/sign_in");
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal server error");
  }
});

// Pizza
app.get('/pizza', async (req, res) => {
  try {
    if (req.user && req.user.email) {
      const user = await User.findOne({ email: req.user.email });
      const username = user.username;

      const products = await Product.find();
      const orders = req.user.order;

      res.render("pizza", { username: username, user: user, products: products, orders: orders });
      
    } else {
      res.redirect("/sign_in");
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal server error");
  }
});
// Pepperoni Pizza
app.get('/pepperoni-pizza', async (req, res) => {
  try {
    if (req.user && req.user.email) {
      const user = await User.findOne({ email: req.user.email });
      const username = user.username;

      const products = await Product.find();
      const orders = req.user.order;

      res.render("pepperoni-pizza", { username: username, user: user, products: products, orders: orders });
      
    } else {
      res.redirect("/sign_in");
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal server error");
  }
});

// Profile
app.get('/profile', async (req, res) => {
  try {
    if (req.user && req.user.email) {
      const user = await User.findOne({ email: req.user.email });
      const username = user.username;

      const products = await Product.find();
      const orders = req.user.order;

      res.render("profile", { username: username, user: user, products: products, orders: orders });
      
    } else {
      res.redirect("/sign_in");
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("Internal server error");
  }
});

app.listen(3000, function() {
    console.log("Server started on port 3000");
});