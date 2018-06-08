var functions = require('firebase-functions');
var express = require('express');
var app = express();

var cors = require('cors');

var bodyparser = require('body-parser');
var recipelib = require('./recipelib');
var expressMongo = require('express-mongo-db');

var mongo = require('mongodb');
var MongoClient = mongo.MongoClient;

var config = require('./config.secret');
app.use(bodyparser.json());
app.use(cors());
app.use(expressMongo(config.mongo_uri));


app.put('/recipe', function(req,res) {
  console.log("recipe put called", req.body);
  var recipe = {
    title: req.body.title,
    time: req.body.time,
    desc: req.body.desc,
    ingredient: req.body.ingredient,
    instruction: req.body.instruction,
  }
  req.db.collection("recipes").insertOne(recipe, function(err, result){
    if (err) throw err;
    console.log("1 recipe inserted", recipe);
  })
})

app.post('/recipe/:id', function(req,res) {
  console.log("recipe update has been called");
  var recipe = {
    title: req.body.title,
    time: req.body.time,
    desc: req.body.desc,
    ingredient: req.body.ingredient,
    instruction: req.body.instruction,
  }
  var o_id = new mongo.ObjectId(req.params.id);

  req.db.collection("recipes").update({'_id': o_id},
    { $set: recipe }, function(err, result){
    if (err) throw err;
    console.log("1 item updated");
  });
})

app.get('/recipe/:id', function(req,res){
  console.log("get one recipe called");

  var o_id = new mongo.ObjectId(req.params.id);
  req.db.collection("recipes").findOne({'_id': o_id}, function(err, result){
    if (err) throw err;
    recipe = result;
    console.log("recipe found:", recipe);
    res.json(recipe);
  });
})

app.get('/recipes', function(req,res) {
  console.log("get all recipes called");
  req.db.collection("recipes").find({}).toArray(function(err, result){
    if (err) throw err;
    var recipes = result;
    if (recipes.length === 0){
      return undefined;
    }
    console.log("items found in database", recipes);
    res.json(recipes);
  });
})

app.delete('/recipe/:id', function(req,res){
  console.log("delete recipe called");
  var o_id = new mongo.ObjectID(req.params.id);
  req.db.collection("recipes").deleteOne({'_id': o_id}, function(err, result){
    if (err) throw err;
    console.log("1 item deleted");
    res.end();
  });
})

app.listen(4000);

/*recipelib.initialize(function(){
  app.listen(4000);
  console.log("server listening on 4000");
});
*/

const api_v1 = functions.https.onRequest(app);

module.exports = {
  api_v1
}
