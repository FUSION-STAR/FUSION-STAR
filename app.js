const express = require('express');
const ejs = require("ejs");
const bodyParser = require('body-parser');
const sass = require('node-sass');

const app = express();

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

//Sign Up
app.get('/sign_up', (req, res) => {
    res.render('sign_up');
});
app.post('/sign_up', (req, res) => {
	const { username, email, password } = req.body;
	const newUser = new user({
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
  


app.listen(3000, function() {
    console.log("Server started on port 3000");
});