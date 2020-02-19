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

describe('Pantry (using sample data)', function() {
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

describe('Pantry (using full data)', function() {
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
     expect(pantry.contents[33].amount).to.equal(4)
    const recipe = new Recipe(recipeData[0], ingredientsData)
    pantry.cookMeal(recipe)
    expect(pantry.contents[33].amount).to.equal(2.5)

  })

  it('should be able to say what ingredients are needed if not enough in pantry', function() {
    let recipe2 = new Recipe(recipeData[2], ingredientsData)
    expect(pantry.getItemsNeeded(recipe2)).to.deep.equal(
      [
        { name: 'black pepper', quantityNeeded: 3, id: 1002030, cost: 1764 },
        { name: 'brown sugar', quantityNeeded: 3.5, id: 19334, cost: 4472 },
        { name: 'canola oil', quantityNeeded: 1, id: 4582, cost: 3228 },
        { name: 'chicken wings', quantityNeeded: 1, id: 5100, cost: 593 },
        { name: 'chili powder', quantityNeeded: 3, id: 2009, cost: 1996 },
        { name: 'garlic powder', quantityNeeded: 4, id: 1022020, cost: 1376 },
        { name: 'hot sauce', quantityNeeded: 8, id: 6168, cost: 6872 },
        { name: 'mango', quantityNeeded: 0.5, id: 9176, cost: 212.5 },
        { name: 'onion powder', quantityNeeded: 4, id: 2026, cost: 2388 },
        {
          name: 'seasoning salt',
          quantityNeeded: 1.5,
          id: 1042047,
          cost: 501
        },
        {
          name: 'seasoning salt',
          quantityNeeded: 4,
          id: 1042047,
          cost: 1336
        }
      ]
    )
  })

  it('should be able to calculate how much it will cost to buy the necessary ingredients, based on what’s in the pantry', function() {
    let recipe2 = new Recipe(recipeData[2], ingredientsData)
    expect(pantry.getCostOfItemsNeeded(recipe2)).to.equal(24738.5)
  })


})
