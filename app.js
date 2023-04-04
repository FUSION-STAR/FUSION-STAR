//Import express, ejs, mongoose, body-parser, node-sass to app.js
const express = require('express');
const mongoose = require('mongoose');
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
  


app.listen(3000, function() {
    console.log("Server started on port 3000");
});