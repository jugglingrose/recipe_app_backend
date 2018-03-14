const uuidv4 = require('uuid/v4');

var obj = {};
var recipes = {};

var mongo = require('mongodb');
var MongoClient = mongo.MongoClient;

var config = require('./config.secret');
var db;


obj.initialize = function(callback) {
  ///connect to mongodb
  MongoClient.connect(config.mongo_uri, function(err, database) {
    if (err) throw err;
    console.log("succesfully connected to database");
    db = database;
    //call a callback
    callback();
  });
}

/*placeholder recipe until we get our database*/
var tempuuid = uuidv4();
var temprecipe = {
  title: "cinammon roll",
  time:  "20",
  description: "yummy cinammon rolls",
  ingredient:  ["dough", "cinammon", "icing"],
  instruction: ["preheat oven", "bake", "add icing"],
  id: tempuuid
}
recipes[tempuuid] = temprecipe;

obj.create = function(title, time, desc, ingredient, instruction){
  var recipe = {
    title: title,
    time: time,
    desc: desc,
    ingredient: ingredient,
    instruction: instruction,
    _id: uuidv4()
  }
  recipes[recipe.id] = recipe;
  const myDatabase = db.db("recipe_app_db");
  myDatabase.collection("recipes").insertOne({'recipe': recipe}, function(err, result){
    if (err) throw err;
    console.log("1 recipe inserted");
  })
  return recipe;
}

obj.update = function(id, title, time, desc, ingredient, instruction){
  console.log("I'm in update!");
  var recipe = {
    title: title,
    time: time,
    desc: desc,
    ingredient: ingredient,
    instruction: instruction,
    id: id
  }
  recipes[recipe.id] = recipe;
  return recipe;
}
  /*recipes[id] = {
    title: title,
    time: time,
    desc: desc,
    ingredient: ingredient,
    instruction: instruction,
    id: id
  }
  recipes[id] = recipes[id];
  return recipe;
}*/

obj.delete = function(id){
  console.log("I'm in delete!", id);
  delete recipes[id];
  const myDatabase = db.db("recipe_app_db");
  myDatabase.collection("recipes").deleteOne({'_id': ObjectId(id)}, function(err, result){
    if (err) throw err;
    console.log("1 item deleted");

  });
}

obj.getOne = function(id){
  console.log("I'm in get one recipe");
  return recipes[id];
}

obj.getAll = function(){
  console.log("I'm in get! Happy Dance!");
  if(recipes.length === 0){
    return undefined;
  }
  return recipes;
}

module.exports = obj;
