const express = require('express');
const ejs = require("ejs");
const bodyParser = require('body-parser');
const sass = require('node-sass');
const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const session = require('express-session');

const db = require("./config/db.js");
const User = require('./model/user');
const app = express();

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.use(session({
    secret: 'secret key',
    resave: false,
    saveUninitialized: false
}));

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

//Sign Up
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

//Sign In
app.get('/sign_in', (req, res) => {
    res.render('sign_in');
});
app.post('/sign_in', passport.authenticate('local', {
	successRedirect: '/home',
	failureRedirect: '/sign_in',
	failureFlash: true
}));

app.listen(3000, function() {
    console.log("Server started on port 3000");
});