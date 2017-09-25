/**
 * midlle ware to connect frontend with api for summarizer 
 * creates all dependencies and endpoints
 * Author: Lena Arafa
 * Date: 9/24/2017
 */

//List dependencies
const express = require('express', 4.15.4);
const app = express();
const parseurl = require('express');
const bodyparser = require('body-parser');
const path = require('path');
const expressValidator = require('express-validator');
//add dependencies for database

//parse application/JSON
app.use(bodyparser.json());

//parses the body of all incoming requests
app.use(function (req, res) {
    res.setHeader('Content-Type', 'text/plain');
    res.write('you posted:\n');
    res.end(JSON.stringify(req.body, null, 2));
})

//User endpoint
//Forget passowrd mailto endpoint

//Text endpoint; text sumbitted by user is handled here
//This route used for testing purposes until the route 
//needed is created 
app.get('/home/submit', function(req, res){
    //verify the header is "Text"
    //get the body of the text and store in a temp buffer
})

//send the text received from user to api of summarizer
app.post('/api/summarizer', function(req, res){
    
})

//receive the summary from the summarizer api request 
//and add string to db
//using this route for testing purposes until route creates
app.get('/summaarizeTEST', function(req, res){
    //verify header
    //get the ranking and convert to string
})


