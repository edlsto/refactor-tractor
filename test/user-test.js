const chai = require('chai');
const expect = chai.expect;
const spies = require('chai-spies');
chai.use(spies);

import domUpdates from '../src/domUpdates';
import User from '../src/user.js';

chai.spy.on(domUpdates, ['populateCards', 'searchByName', 'viewFavorites', 'filterRecipes', 'viewRecipesToCook'], () => {})

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

let user1

describe('User tests', () => {
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
      ingredientsData: [{id: 1009016, name: "apple cider", estimatedCostInCents: 468}, {id: 9003, name: "apple", estimatedCostInCents: 207}, {id: 93760, name: "Whole Grain Teff Flour", estimatedCostInCents: 539}, {id: 1123, name: "eggs", estimatedCostInCents: 472
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
      }]
    });
  });

  afterEach(() => {
    chai.spy.restore()
    chai.spy.on(domUpdates, ['populateCards', 'searchByName', 'viewFavorites', 'filterRecipes', 'viewRecipesToCook'], () => {})
  })

  it('Should have a property of favoriteRecipes with a default value', () => {
    expect(user1.favoriteRecipes).to.eql([]);
  });

  it('Should be able to add recipes to favoriteRecipes', () =>{
    user1.addToFavorites(recipes.recipeData[0])
    expect(user1.favoriteRecipes.includes(recipes.recipeData[0])).to.eql(true);
  });

  it('Should be able to remove recipes from favoriteRecipes', () =>{
    user1.removeFromFavorites(recipes.recipeData[0]);
    expect(user1.favoriteRecipes).to.eql([]);
  });

  it('Should be able to filter through favoriteRecipes by tag', () => {
    user1.addToFavorites(recipes.recipeData[0]);
    user1.addToFavorites(recipes.recipeData[1]);
    expect(user1.filterFavorites('antipasti')).to.eql([recipes.recipeData[0]]);
  });

  it('Should be able to filter through favoriteRecipes by tag and not return a recipe if none contain that tag', () => {
    user1.addToFavorites(recipes.recipeData[0]);
    user1.addToFavorites(recipes.recipeData[1]);
    expect(user1.filterFavorites('breakfast')).to.eql([]);
  });

  it('Should be able to search favoriteRecipes by name or ingredient', () => {
    user1.addToFavorites(recipes.recipeData[0]);
    user1.addToFavorites(recipes.recipeData[1]);
    expect(user1.findFavorites('cider')).to.eql([recipes.recipeData[1]]);
  });

  it('Should be able to filter through favoriteRecipes by ingredient and not return a recipe if none contain that ingredient', () => {
    user1.addToFavorites(recipes.recipeData[0]);
    user1.addToFavorites(recipes.recipeData[1]);
    expect(user1.filterFavorites('cheese')).to.eql([]);
  });

  it('Should be able to add recipes to a list of recipes to cook', () => {
    user1.addRecipesToCook(recipes.recipeData[0])
    expect(user1.recipesToCook.includes(recipes.recipeData[0])).to.eql(true);
  });

  it('Should only add the recipe a user selects to a list of recipes to cook', () => {
    user1.addRecipesToCook(recipes.recipeData[0])
    expect(user1.recipesToCook.includes(recipes.recipeData[1])).to.eql(false);
  });

  it('Should be able to remove a recipe from the list of recipes to cook', () => {
    user1.addRecipesToCook(recipes.recipeData[0])
    user1.removeFromRecipesToCook(recipes.recipeData[0])
    expect(user1.recipesToCook.includes(recipes.recipeData[0])).to.eql(false);
  });

  it('Should be able to filter recipes to cook by type', () => {
    user1.addRecipesToCook(recipes.recipeData[0]);
    user1.addRecipesToCook(recipes.recipeData[1]);
    expect(user1.filterRecipesToCook('antipasti')).to.eql([recipes.recipeData[0]]);
  });

  it('Should not filter recipes if the type provided is not present', () => {
    user1.addRecipesToCook(recipes.recipeData[0]);
    user1.addRecipesToCook(recipes.recipeData[1]);
    expect(user1.filterRecipesToCook('dessert')).to.eql([]);
  });

  it('Should be able to search recipesToCook by name', () => {
    user1.addRecipesToCook(recipes.recipeData[0]);
    user1.addRecipesToCook(recipes.recipeData[1]);
    expect(user1.findRecipeToCook('Loaded Chocolate Chip Pudding Cookie Cups')).to.eql([recipes.recipeData[0]]);
  });

  it('Should be able to search recipesToCook by ingredient name', () => {
    user1.addRecipesToCook(recipes.recipeData[0]);
    user1.addRecipesToCook(recipes.recipeData[1]);
    expect(user1.findRecipeToCook('apple')).to.eql([recipes.recipeData[1]]);
  });

  it('Should not filter recipesToCook by ingredient name if that ingredient does not exist', () => {
    user1.addRecipesToCook(recipes.recipeData[0]);
    user1.addRecipesToCook(recipes.recipeData[1]);
    expect(user1.findRecipeToCook('cheese')).to.eql([]);
  });

  it ('should populate cards on startup', () => {
    user1.populateCards()
    expect(domUpdates.populateCards).to.have.been.called(1);
    expect(domUpdates.populateCards).to.have.been.called.with(user1);
  });

  it ('should be able to filter the DOM on search', () => {
    user1.searchByName()
    expect(domUpdates.searchByName).to.have.been.called(1);
    expect(domUpdates.searchByName).to.have.been.called.with(user1);
  })

  it ('should be able to filter the DOM by favorites', () => {
    user1.viewFavorites()
    expect(domUpdates.viewFavorites).to.have.been.called(1);
    expect(domUpdates.viewFavorites).to.have.been.called.with(user1);
  })

  it ('should be able to filter the DOM by type', () => {
    user1.filterRecipes(['antipasti'])
    expect(domUpdates.filterRecipes).to.have.been.called(1);
    expect(domUpdates.filterRecipes).to.have.been.called.with(user1);
  })

  it ('should be able to filter the DOM by recipes to cook', () => {
    let event = {}
    user1.viewRecipesToCook(event)
    expect(domUpdates.viewRecipesToCook).to.have.been.called(1);
    expect(domUpdates.viewRecipesToCook).to.have.been.called.with(user1);
  })

});
