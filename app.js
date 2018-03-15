var express = require('express');
var app = express();

var cors = require('cors');

var bodyparser = require('body-parser');
var recipelib = require('./recipelib');

app.use(bodyparser.json());
app.use(cors());


app.put('/recipe', function(req,res) {
  console.log("recipe put called", req.body);
  var recipe = recipelib.create(req.body.title, req.body.time, req.body.desc, req.body.ingredient, req.body.instruction);
  res.json(recipe);
});

app.post('/recipe/:id', function(req,res) {
  console.log("recipe update has been called");
  var recipe = recipelib.update(req.params.id, req.body.title, req.body.time,req.body.desc, req.body.ingredient,
    req.body.instruction, function(recipe){
        res.json(recipe);
    });
});

app.get('/recipe/:id', function(req,res){
  console.log("get one recipe called");
  var recipe = recipelib.getOne(req.params.id, function(recipe){
      res.json(recipe);
  });
});

app.delete('/recipe/:id', function(req,res){
  console.log("delete recipe called");
  recipelib.delete(req.params.id);
  res.end();
});

app.get('/recipes', function(req,res) {
  console.log("get recipe called");
  var recipes = recipelib.getAll(function(recipes){
      res.json(recipes);
  });
});


recipelib.initialize(function(){
  app.listen(4000);
  console.log("server listening on 4000");
});
