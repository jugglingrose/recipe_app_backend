const uuidv4 = require('uuid/v4');

var obj = {};
var recipes = {};

var mongo = require('mongodb');
var MongoClient = mongo.MongoClient;


obj.initialize = function(callback) {
    callback();
}

/*placeholder recipe until we get our database
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
*/

obj.create = function(db, title, time, desc, ingredient, instruction, callback){
  var recipe = {
    title: title,
    time: time,
    desc: desc,
    ingredient: ingredient,
    instruction: instruction,
    /*_id: uuidv4()*/
  }
  //recipes[recipe.id] = recipe;
  db.collection("recipes").insertOne(recipe, function(err, result){
    if (err) throw err;
    console.log("1 recipe inserted", recipe);
    callback(recipe);
  })
}

obj.update = function(db, id, title, time, desc, ingredient, instruction, callback){
  console.log("I'm in update!");
  var recipe = {
    title: title,
    time: time,
    desc: desc,
    ingredient: ingredient,
    instruction: instruction,
  }
  var o_id = new mongo.ObjectId(id);

  db.collection("recipes").update({'_id': o_id},
    { $set: recipe }, function(err, result){
    if (err) throw err;
    console.log("1 item updated");
    callback(recipe);
  });
  console.log("one item has been updated");
  /*
  recipes[recipe.id] = recipe;
  return recipe;*/
}

obj.delete = function(db, id, callback){
  console.log("I'm in delete!", id);
  delete recipes[id];
  var o_id = new mongo.ObjectID(id);
  db.collection("recipes").deleteOne({'_id': o_id}, function(err, result){
    if (err) throw err;
    console.log("1 item deleted");
    callback();
  });
}

obj.getOne = function(db, id, callback){
  var recipe = "";
  console.log("I'm in get one recipe");
  var o_id = new mongo.ObjectId(id);
  db.collection("recipes").findOne({'_id': o_id}, function(err, result){
    if (err) throw err;
    recipe = result;
    console.log("recipe found:", recipe);
    callback(recipe);
  });
}

obj.getAll = function(db, callback){
  console.log("I'm in get! Happy Dance!");
  db.collection("recipes").find({}).toArray(function(err, result){
    if (err) throw err;
    var recipes = result;
    if (recipes.length === 0){
      return undefined;
    }
    console.log("items found in database", recipes);
    callback(recipes);
  });
}

module.exports = obj;
