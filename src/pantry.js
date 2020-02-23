
class Pantry {
  constructor(userIngredients) {
    this.contents = userIngredients;
  }

  findInPantry(recipeItemId) {
    return this.contents.find(pantryItem => {
      return pantryItem.ingredient === recipeItemId
    });
  }

  addToPantry(id, amountToAdd) {
    let item = this.findInPantry(id)
    if (item) {
      this.contents.find(pantryItem => {
        return pantryItem.ingredient === id
      }).amount += amountToAdd;
    } else {
      this.contents.push({
        'ingredient': id,
        'amount': amountToAdd
      })
    }
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
      }).map(ingredient => {
        let quantityInPantry;
        if (!this.contents.find(pantryItem => {
          return pantryItem.ingredient === ingredient.id
        })) {
          quantityInPantry = 0
        } else {
          quantityInPantry = ingredient.quantity.amount - this.contents.find(pantryItem => {
            return pantryItem.ingredient === ingredient.id
          }).amount
        };
        let ingredientData = recipe.ingredientsData.find(ingredentInfoItem => ingredient.id === ingredentInfoItem.id);
        // console.log(this.contents)
        return {
          name: ingredientData.name,
          id: ingredient.id,
          quantityNeededInRecipe: ingredient.quantity.amount,
          quantityInPantry: quantityInPantry,
          amountNeeded: ingredient.quantity.amount - quantityInPantry,
          costPerItem: ingredientData.estimatedCostInCents,
          costOfWhatsNeededInCents: (ingredient.quantity.amount - quantityInPantry) * ingredientData.estimatedCostInCents,
          unit: ingredient.quantity.unit
        }

      })
      return itemsNeeded
    }
  }

  getCost(item, amount, recipe) {
    return recipe.ingredients.find(ingredient => {
      return ingredient.id === item.id
    }).estimatedCostInCents * amount
  }

  getCostOfItemsNeeded(recipe) {
    let itemsNeeded = this.getItemsNeeded(recipe);
    return itemsNeeded.reduce((totalCost, item) => {
      totalCost += item.costOfWhatsNeededInCents
      return totalCost;
    }, 0)
  }

}

export default Pantry;
