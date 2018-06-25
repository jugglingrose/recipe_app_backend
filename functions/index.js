var functions = require('firebase-functions');
var express = require('express');
var app = express();

var cors = require('cors');

var bodyparser = require('body-parser');
var expressMongo = require('express-mongo-db');

var mongo = require('mongodb');
var MongoClient = mongo.MongoClient;

var config = require('./config.secret');
app.use(bodyparser.json());
app.use(cors({origin:"http://localhost:3000", credentials: true}));
app.use(expressMongo(config.mongo_uri));

//Bcrypt for password hashing//
var bcrypt = require('bcrypt');
const saltRounds = 10;

//Cookie Parser//
var cookieParser = require('cookie-parser');
app.use(cookieParser(config.cookie_secret));

/* -- Recipes -- */
//put is for creating something new. Insert a new recipe to DB//
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
    res.json(recipe);

  })
})

//Update a Recipe
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
    res.json(recipe);
  });
})

//Get the details of a recipe
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

//Get all of the recipes
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

//Delete A recipe
app.delete('/recipe/:id', function(req,res){
  console.log("delete recipe called");
  var o_id = new mongo.ObjectID(req.params.id);
  req.db.collection("recipes").deleteOne({'_id': o_id}, function(err, result){
    if (err) throw err;
    console.log("1 item deleted");
    res.end();
  });
})

/*----- Log In/Sign Up ------*/

//add new user to database//
app.put('/signup', function(req,res) {
  console.log("sign up called");
  var name = req.body.name;
  var username = req.body.username;
  var password = req.body.password;
  console.log( username + " " + password);
  bcrypt.hash(password, saltRounds, function(err, hash) {
    req.db.collection("authenticate").insertOne({"_id": username, "name": name,
    "password": hash}, function(err, result){
      if (err) throw err;
      console.log("new user has been added to database");
    })
  })
})

//find user, login//
app.post('/login', function(req,res){
  console.log("I am in login");
  var username = req.body.username;
  var password = req.body.password;
  req.db.collection("authenticate").findOne({"_id": username}, function(err, user) {
    if (err) throw err;
    if(!user){
      console.log("user not found");
      res.status(401);
      res.send("username not found");
    }
    else{
      console.log(user);
      bcrypt.compare(password, user.password, function(err, result) {
        if(result){
          console.log("username and password match");
          //create a signed cookie//
          res.cookie('userid', user._id, {signed: true});
          /*res.json({authed: true});*/
          res.json(true);
        }
        else{
          console.log("username and password do not match");
          res.status(401);
          res.send("username and password do not match");
        }
      })
    }
  })
})

app.get('/login', function(req,res){
  console.log(" I am in get login");
  var username = req.signedCookies.userid
  if(username === undefined){
    /*res.json({authed: false});*/
    res.status(401);
    res.json(false);
  }else{
    console.log(username + " is logged in");
    /*res.json({authed: true});*/
    res.json(true);
  }

})

//log out, cookies cleared//
app.get('/logout', function(req,res){
  res.clearCookie('userid');
  console.log("logged out");
  res.end();
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
