const chai = require('chai');
const expect = chai.expect;
const spies = require('chai-spies');
chai.use(spies);

import User from '../src/user';
import Pantry from '../src/pantry'
import ingredientsData from '../src/data/ingredients.js'
import recipeData from '../src/data/recipes.js'
import Recipe from '../src/recipe.js'

let user1;


let recipes = {
  recipeData: [
    {
      id: 595736,
      image: "https://spoonacular.com/recipeImages/595736-556x370.jpg",
      ingredients: [
        {
          id: 20081,
          quantity: {
            amount: 1.5,
            unit: "c"
          }
        },
        {
          id: 18372,
          quantity: {
            amount: 0.5,
            unit: "tsp"
          }
        },
      ],
      name: "Loaded Chocolate Chip Pudding Cookie Cups",
      tags: [
        "antipasti",
        "starter",
        "snack",
        "appetizer",
        "antipasto",
        "hor d'oeuvre"
      ]
    },
    {
      id: 678353,
      image: "https://spoonacular.com/recipeImages/678353-556x370.jpg",
      ingredients: [
        {
          id: 1009016,
          quantity: {
            amount: 1.5,
            unit: "cups"
          }
        },
        {
          id: 9003,
          quantity: {
            amount: 2,
            unit: ""
          }
        }
      ],
      name: "Maple Dijon Apple Cider Grilled Pork Chops",
      tags: [
        "lunch",
        "main course",
        "main dish",
        "dinner"
      ]
    }
  ]
}

describe('Pantry (using sample data)', function() {
  beforeEach(() => {
    user1 = new User(1, 'Boba', [
      {
        'ingredient': 1077,
        'amount': 1
      },
      {
        'ingredient': 14412,
        'amount': 1
      },
      {
        'ingredient': 93760,
        'amount': 3
      }
    ],
    recipes,
    {
      ingredientsData:
        [
          {
            id: 1009016,
            name: "apple cider",
            estimatedCostInCents: 468
          },
          {
            id: 9003,
            name: "apple",
            estimatedCostInCents: 207
          },
          {
            id: 93760,
            name: "Whole Grain Teff Flour",
            estimatedCostInCents: 539
          },
          {
            id: 1123,
            name: "eggs",
            estimatedCostInCents: 472
          },
          {
            id: 20081,
            name: "wheat flour",
            estimatedCostInCents: 142
          },
          {
            id: 18372,
            name: "bicarbonate of soda",
            estimatedCostInCents: 582
          }
        ]
      }
    );
  });

  it('should be a function', function() {
    expect(Pantry).to.be.a('function');
  });

  it('should be an instance of Pantry', function() {
    expect(user1.pantry).to.be.an.instanceof(Pantry);
  });

  it('should create a pantry with ingredients', function() {
    expect(user1.pantry.contents).to.deep.equal([
      { ingredient: 1077, amount: 1 },
      { ingredient: 14412, amount: 1 },
      { ingredient: 93760, amount: 3 }
    ]);
  });
})

describe('Pantry', function() {
  beforeEach(() => {
    user1 = new User(1, 'Boba', [
      {
        'ingredient': 1009016,
        'amount': 2
      },
      {
        'ingredient': 9003,
        'amount': 2
      },
      {
        'ingredient': 93760,
        'amount': 3
      }
    ],
    recipes,
    {
      ingredientsData:
        [
          {
            id: 1009016,
            name: "apple cider",
            estimatedCostInCents: 468
          },
          {
            id: 9003,
            name: "apple",
            estimatedCostInCents: 207
          },
          {
            id: 93760,
            name: "Whole Grain Teff Flour",
            estimatedCostInCents: 539
          },
          {
            id: 1123,
            name: "eggs",
            estimatedCostInCents: 472
          },
          {
            id: 20081,
            name: "wheat flour",
            estimatedCostInCents: 142
          },
          {
            id: 18372,
            name: "bicarbonate of soda",
            estimatedCostInCents: 582
          }
        ]
      }
    );
  });

  it('should be able to determine whether it can cook a specific meal', function() {
    const recipe = recipes.recipeData[1]
    recipe.ingredients[0].quantity.amount = 2;
    recipe.ingredients[1].quantity.amount = 2;
    expect(user1.pantry.canCookMeal(recipe)).to.equal(true)
    let recipe2 = new Recipe(recipeData[0], user1.pantry.ingredientsData)
    expect(user1.pantry.canCookMeal(recipe2)).to.equal(false)
  })

  it('should be able to subtract ingredients from pantry once a meal is cooked', function() {
    expect(user1.pantry.contents[2].amount).to.equal(3)
    const recipe = new Recipe(recipeData[0], ingredientsData)
    user1.pantry.cookMeal(recipe)
    expect(user1.pantry.contents[2].amount).to.equal(3)
  })

  it('should be able to say what ingredients are needed if not enough in pantry', function() {
    expect(user1.pantry.getItemsNeeded(recipes.recipeData[0])).to.deep.equal(
    [
        {
          id: 20081,
          quantityNeededInRecipe: 1.5,
          quantityInPantry: 0,
          amountNeeded: 1.5,
          name: 'wheat flour',
          costPerItem: 142,
          costOfWhatsNeededInCents: 213,
          unit: 'c'
        },
        {
          id: 18372,
          quantityNeededInRecipe: 0.5,
          quantityInPantry: 0,
          amountNeeded: 0.5,
          name: 'bicarbonate of soda',
          costPerItem: 582,
          costOfWhatsNeededInCents: 291,
          unit: 'tsp'
        }
      ]
    )
  })

  it('should be able to calculate how much it will cost to buy the necessary ingredients, based on what’s in the pantry', function() {
    let recipe2 = recipes.recipeData[0]
    expect(user1.pantry.getCostOfItemsNeeded(recipe2)).to.equal(504)
  })

  it('should be able to add items to pantry', function() {
    expect(user1.pantry.contents[0].amount).to.equal(2)
    user1.pantry.addToPantry(1009016, 3)
    expect(user1.pantry.contents[0].amount).to.equal(5)
  })

  it ('should be able to add items to pantry', () => {
    chai.spy.on(user1.pantry, 'addIngredients', () => {})
    let recipe2 = recipes.recipeData[0]
    user1.pantry.addIngredients(user1, recipe2)
    expect(user1.pantry.addIngredients).to.have.been.called(1);
    expect(user1.pantry.addIngredients).to.have.been.called.with(user1, recipe2);
  });

  it ('should be able to remove items from pantry', () => {
    chai.spy.on(user1.pantry, 'deleteIngredients', () => {})
    let recipe2 = recipes.recipeData[0]
    user1.pantry.deleteIngredients(user1, recipe2)
    expect(user1.pantry.deleteIngredients).to.have.been.called(1);
    expect(user1.pantry.deleteIngredients).to.have.been.called.with(user1, recipe2);
  });

})
