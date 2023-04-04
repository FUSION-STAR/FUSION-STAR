const express = require('express');
const ejs = require("ejs");
const bodyParser = require('body-parser');
const sass = require('node-sass');

const app = express();



app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

//Sign In
app.get('/sign_in', (req, res) => {
    res.render('sign_in');
});
  


app.listen(3000, function() {
    console.log("Server started on port 3000");
});