const chai = require('chai');
const expect = chai.expect;

import User from '../src/user';
import Pantry from '../src/pantry'
import sampleData from '../src/data/users-sample.js'
import data from '../src/data/users.js'
import ingredientsData from '../src/data/ingredients.js'
import recipeData from '../src/data/recipes.js'
import Recipe from '../src/recipe.js'
let user, pantry;

describe('Pantry', function() {
  beforeEach(function() {
    user = new User(sampleData[0].id, sampleData[0].name, sampleData[0].pantry);
    pantry = new Pantry(user.pantry)
  });

  it('should be a function', function() {
    expect(Pantry).to.be.a('function');
  });

  it('should be an instance of Pantry', function() {
    expect(pantry).to.be.an.instanceof(Pantry);
  });

  it('should create a pantry with ingredients', function() {
    expect(pantry.contents).to.deep.equal([
      { ingredient: 11477, amount: 1 },
      { ingredient: 93820, amount: 1 },
      { ingredient: 11297, amount: 3 },
      { ingredient: 11547, amount: 5 },
      { ingredient: 1082047, amount: 5 }
    ]);
  });



  })



describe('Pantry with full data', function() {
  beforeEach(function() {
    user = new User(data[1].id, data[1].name, data[1].pantry);
    pantry = new Pantry(user.pantry)
  });

  it('should be able to determine whether it can cook a specific meal', function() {
    const recipe = new Recipe(recipeData[0], ingredientsData)
    recipe.ingredients[4].quantity.amount = 2;
    recipe.ingredients[7].quantity.amount = 2;
    expect(pantry.canCookMeal(recipe)).to.equal(true)
    let recipe2 = new Recipe(recipeData[1], ingredientsData)
    expect(pantry.canCookMeal(recipe2)).to.equal(false)

  })

  it('should be able to subtract ingredients from pantry once a meal is cooked', function() {
    // console.log(pantry)

    const recipe = new Recipe(recipeData[0], ingredientsData)
    pantry.cookMeal(recipe)
  })

})
