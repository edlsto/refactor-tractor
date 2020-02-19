class Pantry {
  constructor(userIngredients) {
    this.contents = userIngredients;
  }

  canCookMeal(recipe) {
    // console.log(this.contents)
    // console.log(recipe.ingredients)
    for (let i = 0; i < recipe.ingredients.length; i++) {
      let pantryItem = this.contents.find(pantryItem => {
        return pantryItem.ingredient === recipe.ingredients[i].id
      });
      // if (!pantryItem) {
      //   console.log('in pantry: no')
      // } else {
      //   console.log('in pantry ' + pantryItem.amount)
      // }
      // console.log('recipe needs: ' + recipe.ingredients[i].quantity.amount)
      // If we don't have enough of the ingredient
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
    } else {
      let itemsNeeded = recipe.ingredients.filter(recipeIngredient => {
        let pantryItem = this.contents.find(pantryItem => {
          return pantryItem.ingredient === recipeIngredient.id
        });
        return !pantryItem || recipeIngredient.quantity.amount > pantryItem.amount
      })
      itemsNeeded = itemsNeeded.map(item => {
        let pantryItem = this.contents.find(pantryItem => {
          return pantryItem.ingredient === item.id
        });
        if (!pantryItem) {
          return {
            name: item.name,
            quantityNeeded: item.quantity.amount
          }
        } else {
        return {
          name: item.name,
          quantityNeeded: item.quantity.amount - pantryItem.amount
        }
      }
      })
      return itemsNeeded
      };
    }
  }






export default Pantry;
