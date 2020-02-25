import Pantry from './pantry';
import Cookbook from './cookbook';
import Recipe from './recipe'

class User {
  constructor(id, name, pantry, recipes, ingredients) {
    this.id = id;
    this.name = name;
    this.pantry = new Pantry(pantry, ingredients.ingredientsData);
    this.favoriteRecipes = [];
    this.recipesToCook = [];
    this.cookbook = new Cookbook(recipes.recipeData);
	  this.cookbook.recipes = this.cookbook.recipes.map((recipe) => {
	    return new Recipe(recipe, ingredients.ingredientsData)
	  })
  }

  addToFavorites(recipe) {
    if (!this.favoriteRecipes.includes(recipe)) {
      this.favoriteRecipes.push(recipe)
    }
  }

  removeFromFavorites(recipe) {
    const i = this.favoriteRecipes.indexOf(recipe);
    this.favoriteRecipes.splice(i, 1)
  }

  filterFavorites(tag) {
    return this.favoriteRecipes.filter(recipe => {
      return recipe.tags.includes(tag);
    });
  }

  findFavorites(strgToSrch) {
    strgToSrch = strgToSrch.toLowerCase();
    return this.favoriteRecipes.filter(recipe => {
      return recipe.name.toLowerCase().includes(strgToSrch)
      || recipe.ingredients.find(ingredient => {
        let ingredientName = this.pantry.ingredientsData.find((element) => {
           return element.id === ingredient.id;
        })
        return ingredientName.name.includes(strgToSrch);
      });
    });
  }

  addRecipesToCook(recipe) {
    if (!this.recipesToCook.includes(recipe)) {
      this.recipesToCook.push(recipe)
    };
  }

  removeFromRecipesToCook(recipe) {
    const i = this.recipesToCook.indexOf(recipe);
    this.recipesToCook.splice(i, 1)
  }

  filterRecipesToCook(tag) {
    return this.recipesToCook.filter(recipe => {
      return recipe.tags.includes(tag);
    });
  }


  findRecipeToCook(strgToSrch) {
    strgToSrch = strgToSrch.toLowerCase();
    return this.recipesToCook.filter(recipe => {
      return recipe.name.toLowerCase().includes(strgToSrch)
      || recipe.ingredients.find(ingredient => {
        let ingredientName = this.pantry.ingredientsData.find((element) => {
           return element.id === ingredient.id;
        });
        return ingredientName.name.includes(strgToSrch)
    });
  });
 }
}


export default User;
