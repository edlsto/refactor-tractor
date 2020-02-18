class Pantry {
  constructor(userIngredients) {
    this.contents = userIngredients;
  }

  canCookMeal(recipe) {
    let canCook;
    recipe.ingredients.forEach(recipeIngredient => {
      let pantryItem = this.contents.find(pantryItem => {
        return pantryItem.ingredient === recipeIngredient.id
      });
      if (!pantryItem || recipeIngredient.quantity.amount > pantryItem.amount) {
        canCook = false;
      } else {
        canCook = true;
      }
    })
    return canCook;
  }

  cookMeal(recipe) {
    if (this.canCookMeal(recipe)) {
      this.contents = this.contents.map(pantryItem => {

      })
    }
  }
}

export default Pantry;
