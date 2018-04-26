var functions = require('firebase-functions');
var express = require('express');
var app = express();

var cors = require('cors');

var bodyparser = require('body-parser');
var recipelib = require('./recipelib');
var expressMongo = require('express-mongo-db');

var config = require('./config.secret');
app.use(bodyparser.json());
app.use(cors());
app.use(expressMongo(config.mongo_uri));


app.put('/recipe', function(req,res) {
  console.log("recipe put called", req.body);
  var recipe = recipelib.create(req.db, req.body.title, req.body.time, req.body.desc, req.body.ingredient, req.body.instruction,
    function(recipe) {
      res.json(recipe);
    });
});

app.post('/recipe/:id', function(req,res) {
  console.log("recipe update has been called");
  var recipe = recipelib.update(req.db, req.params.id, req.body.title, req.body.time,req.body.desc, req.body.ingredient,
    req.body.instruction, function(recipe){
        res.json(recipe);
    });
});

app.get('/recipe/:id', function(req,res){
  console.log("get one recipe called");
  var recipe = recipelib.getOne(req.db, req.params.id, function(recipe){
      res.json(recipe);
  });
});


app.get('/recipes', function(req,res) {
  console.log("get recipe called");
  var recipes = recipelib.getAll(req.db, function(recipes){
      res.json(recipes);
  });
});


app.delete('/recipe/:id', function(req,res){
  console.log("delete recipe called");
  recipelib.delete(req.db, req.params.id, function(){
      res.end();
  });
});

recipelib.initialize(function(){
  app.listen(4000);
  console.log("server listening on 4000");
});

const api_v1 = functions.https.onRequest(app);

module.exports = {
  api_v1
}
