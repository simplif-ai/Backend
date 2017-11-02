/**
 * midlle ware to connect frontend with api for summarizer
 * creates all dependencies and endpoints
 * Author: Lena Arafa
 * Date: 9/24/2017
 */

//List dependencies
//var bcrypt = require('bcrypt');
//const saltRounds = 10;

var config = require('./config');
require('dotenv').config();
const express = require('express');
const app = express();
const parseurl = require('parseurl');
const bodyparser = require('body-parser');
const path = require('path');
//const expressValidator = require('express-validator');
//const request = require('request');
// const mysql = require('mysql');
// const nodemailer = require('nodemailer');
//const multer = require('multer');
var jwt = require('jsonwebtoken');

app.set('superSecret', config.secret); // secret variable
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(bodyparser.text());
app.use(bodyparser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
// enable cors
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

//seperate endpoints
require('./dbFunc/notes')(app);
require('./mainFunc/summarizerApi')(app);
require('./user/account')(app);
require('./user/password')(app);
require('./user/profile')(app);

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, '/index.html'));
});

//Slackbot endpoint
app.post('/slack/events', function (req, res) {
  res.send(JSON.parse(req.body).challenge);
});

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;

app.listen('8000');
console.log('Listening on port ' + 8000 + '...');
