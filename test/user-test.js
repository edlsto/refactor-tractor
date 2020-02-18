import { expect } from 'chai';

import User from '../src/user.js';
import recipeData from '../src/data/recipes.js'

let user1

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
        'ingredient': 1009054,
        'amount': 3
      }]
    );
  });

  it('Should have a property of favoriteRecipes with a default value', () => {
    expect(user1.favoriteRecipes).to.eql([]);
  });

  it('Should be able to add recipes to favoriteRecipes', () =>{
    user1.addToFavorites(recipeData[0])
    expect(user1.favoriteRecipes.includes(recipeData[0])).to.eql(true);
  });

  it('Should be able to remove recipes from favoriteRecipes', () =>{
    user1.removeFromFavorites(recipeData);
    expect(user1.favoriteRecipes).to.eql([]);
  });

  it('Should be able to filter through favoriteRecipes by tag', () => {
    user1.addToFavorites(recipeData[0]);
    user1.addToFavorites(recipeData[1]);
    expect(user1.filterFavorites('antipasti')).to.eql([recipeData[0]]);
  });

  it('Should be able to search favoriteRecipes by name or ingredient', () => {
    user1.addToFavorites(recipeData[0]);
    user1.addToFavorites(recipeData[1]);
    expect(user1.findFavorites('egg')).to.eql([recipeData[0]]);
  });

  it('Should be able to add recipes to a list of recipes to cook', () => {
    user1.addRecipesToCook(recipeData[0])
    expect(user1.recipesToCook.includes(recipeData[0])).to.eql(true);
  });

  it('Should only add the recipe a user selects to a list of recipes to cook', () => {
    user1.addRecipesToCook(recipeData[0])
    expect(user1.recipesToCook.includes(recipeData[1])).to.eql(false);
  });

  it('Should be able to remove a recipe from the list of recipes to cook', () => {
    user1.addRecipesToCook(recipeData[0])
    user1.removeFromRecipesToCook(recipeData[0])
    expect(user1.recipesToCook.includes(recipeData[0])).to.eql(false);
  });

  it('Should be able to filter recipes to cook by type ', () => {
    user1.addRecipesToCook(recipeData[0]);
    user1.addRecipesToCook(recipeData[1]);
    expect(user1.filterRecipesToCook('antipasti')).to.eql([recipeData[0]]);
  });

  it('Should not filter recipes if the type provided is not present', () => {
    user1.addRecipesToCook(recipeData[0]);
    user1.addRecipesToCook(recipeData[1]);
    expect(user1.filterRecipesToCook('dessert')).to.eql([]);
  });

  it('Should be able to search recipesToCook by name', () => {
    user1.addRecipesToCook(recipeData[0]);
    user1.addRecipesToCook(recipeData[1]);
    expect(user1.findRecipeToCook('Loaded Chocolate Chip Pudding Cookie Cups')).to.eql([recipeData[0]]);
  });

  it('Should be able to search recipesToCook by ingredient name', () => {
    user1.addRecipesToCook(recipeData[0]);
    user1.addRecipesToCook(recipeData[1]);
    expect(user1.findRecipeToCook('egg')).to.eql([recipeData[0]]);
  });

  it('Should not filter recipesToCook by ingredient name if that ingredient does not exist', () => {
    user1.addRecipesToCook(recipeData[0]);
    user1.addRecipesToCook(recipeData[1]);
    expect(user1.findRecipeToCook('cheese')).to.eql([]);
  });
  // it('Should be able to check ingredients in User/s pantry for a given recipe', () => {
  //   console.log(recipeData[0].ingredients);
  //   let recipeIngredients = recipeData[0].ingredients;
  //   expect(user1.checkPantry(recipeIngredients)).to.eql('You have the ingredients!');
  // });
  //
  // it('Should inform User if they lack required ingredients for a given recipe', () => {
  //   expect(user1.checkPantry(recipeIngredients)).to.eql(missingIngredientsWithPrice);
  // });
});
