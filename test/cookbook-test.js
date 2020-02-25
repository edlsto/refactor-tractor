import {expect} from 'chai';


import recipeData from '../src/data/recipes';
import Cookbook from '../src/cookbook';
import User from '../src/user';

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

let cookbook;

describe('User', () => {
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
      }],
      recipes,
      {ingredientsData: [{id: 1009016, name: "apple cider", estimatedCostInCents: 468}, {id: 9003, name: "apple", estimatedCostInCents: 207}, {id: 93760, name: "Whole Grain Teff Flour", estimatedCostInCents: 539}, {id: 1123, name: "eggs", estimatedCostInCents: 472
    },{
id: 20081,
name: "wheat flour",
estimatedCostInCents: 142
},{
id: 18372,
name: "bicarbonate of soda",
estimatedCostInCents: 582
}]}
    );
  });

  it('Should have an array of all recipes', () => {
    expect(user1.cookbook.recipes).to.be.an('array');
  });

  describe('findRecipe', () => {
    it('Should be able to filter through its array by ingredients', () => {
      expect(user1.cookbook.findRecipeByName('cider').length).to.equal(1);
    });

    it('Should be able to filter through its array by name', () => {
      expect(user1.cookbook.findRecipeByName('apple').length).to.equal(1);
    });
  });
})
