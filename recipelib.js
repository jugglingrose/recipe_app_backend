const uuidv4 = require('uuid/v4');

var obj = {};
var recipes = [];


/*placeholder recipe until we get our database
recipes.push({
  title: "cinammon roll",
  time:  "20",
  description: "yummy cinammon rolls",
  ingredient:  ["dough", "cinammon", "icing"],
  instruction: ["preheat oven", "bake", "add icing"],
  id: uuidv4
})*/

obj.create = function(title, time, desc, ingredient, instruction){
  var recipe = {
    title: title,
    time: time,
    desc: desc,
    ingredient: ingredient,
    instruction: instruction,
    id: uuidv4()
  }
  recipes.push(recipe);
  return recipe;

}


module.exports = obj;
