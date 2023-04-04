const express = require('express');
const ejs = require("ejs");
const bodyParser = require('body-parser');
const sass = require('node-sass');
const db = require("./config/db.js");
const user = require('./model/user');
const app = express();

app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

db.connect();

app.listen(3000, function() {
    console.log("Server started on port 3000");
});