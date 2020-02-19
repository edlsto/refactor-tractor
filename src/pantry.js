class Pantry {
  constructor(userIngredients) {
    this.contents = userIngredients;
  }

  findInPantry(recipeItem) {
    return this.contents.find(pantryItem => {
      return pantryItem.ingredient === recipeItem
    });
  }

  canCookMeal(recipe) {
    for (let i = 0; i < recipe.ingredients.length; i++) {
      let pantryItem = this.findInPantry(recipe.ingredients[i].id)
      if (!pantryItem || recipe.ingredients[i].quantity.amount > pantryItem.amount) {
        return false;
      }
    }
    return true;
  }

  cookMeal(recipe) {
    if (this.canCookMeal(recipe)) {
      this.contents = this.contents.map(pantryItem => {
        recipe.ingredients.forEach(ingredient => {
          if (ingredient.id === pantryItem.ingredient) {
            pantryItem.amount -= ingredient.quantity.amount
          }
        })
        return {
          ingredient: pantryItem.ingredient,
          amount: pantryItem.amount
        }
      })
    }
  }
  
  getItemsNeeded(recipe) {
    if (!this.canCookMeal(recipe)) {
      let itemsNeeded = recipe.ingredients.filter(recipeIngredient => {
        let pantryItem = this.findInPantry(recipeIngredient.id)
        return !pantryItem || recipeIngredient.quantity.amount > pantryItem.amount
      })
      itemsNeeded = itemsNeeded.map(item => {
        let pantryItem = this.findInPantry(item.id)
        if (!pantryItem) {
          return {
            name: item.name,
            quantityNeeded: item.quantity.amount,
            id: item.id,
            cost: this.getCost(item, item.quantity.amount, recipe)
          }
        } else {
          return {
            name: item.name,
            quantityNeeded: item.quantity.amount - pantryItem.amount,
            id: item.id,
            cost: this.getCost(item, item.quantity.amount, recipe)
          }
        }
      })
      return itemsNeeded
    }
  }

  getCost(item, amount, recipe) {
    return recipe.ingredientsData.find(ingredient => {
      return ingredient.id === item.id
    }).estimatedCostInCents * amount
  }

  getCostOfItemsNeeded(recipe) {
    let itemsNeeded = this.getItemsNeeded(recipe);
    return itemsNeeded.reduce((totalCost, item) => {
      totalCost += item.cost
      return totalCost;
    }, 0)
  }

}







export default Pantry;
