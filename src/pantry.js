class Pantry {
  constructor(userIngredients, ingredientsData) {
    this.contents = userIngredients;
    this.ingredientsData = ingredientsData;
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
    return recipe.ingredients.map(ingredient => {
      return {
        ingredientId: ingredient.id,
        amountInRecipe: ingredient.quantity.amount
      }
    })
  }

  getItemsNeeded(recipe) {
    if (!this.canCookMeal(recipe)) {
      let initialList = recipe.ingredients.filter(recipeIngredient => {
        let pantryItem = this.findInPantry(recipeIngredient.id)
        if (!pantryItem) {
          return true;
        }
        return recipeIngredient.quantity.amount > pantryItem.amount
      })
      let itemsNeeded = initialList.map(ingredient => {
         this.contents.find(pantryItem => {
          return pantryItem.ingredient === ingredient.id
        })
        const amountInPantry = this.contents.find(pantryIngredient => pantryIngredient.id === ingredient.id) || 0;
        const quantityNeededInRecipe = ingredient.quantity.amount
        const ingredientData = this.ingredientsData.find(ingredentInfoItem => ingredient.id === ingredentInfoItem.id);

        return {
          id: ingredient.id,
          quantityNeededInRecipe: quantityNeededInRecipe,
          quantityInPantry: amountInPantry,
          amountNeeded: quantityNeededInRecipe - amountInPantry,
          name: ingredientData.name,
          costPerItem: ingredientData.estimatedCostInCents,
          costOfWhatsNeededInCents: (quantityNeededInRecipe - amountInPantry) * ingredientData.estimatedCostInCents,
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

getIngredientById(recipe) {
  console.log(this.cookMeal(recipe), 'fn-call')
  return this.cookMeal(recipe).map((ingredient) => {
    return ingredient.ingredientId
  })
}

getIngredientModification(recipe) {
  this.cookMeal(recipe).map((ingredient) => {
    return ingredient.amountNeeded
})
}

deleteIngredients(user, recipe) {
  if (this.canCookMeal(recipe)) {
  const ingredients = this.cookMeal(recipe);
  const deleteIngredientsFetchArray = ingredients.map((ingredient) => {
    console.log(user.id, ingredient.ingredientId, -Math.abs(ingredient.amountInRecipe),  'infoToPost')
    return fetch( 'https://fe-apps.herokuapp.com/api/v1/whats-cookin/1911/users/wcUsersData', {
        method: 'POST',
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          "userID": user.id,
          "ingredientID": ingredient.ingredientId,
          "ingredientModification": -Math.abs(ingredient.amountInRecipe)
      })
    }).then(response => response.json())
    .then(json => console.log(json))
    .catch(error => console.log(error.message))

  })
  console.log(deleteIngredientsFetchArray, '2')
  Promise.all(deleteIngredientsFetchArray).then(promises => {
      alert('Ingredients Deleted!');
    }).catch(error => console.log(error.message)) ;
  } else {
    alert('You don\'t have enough ingredients to cook this meal!')
  }
}

  addIngredients(user, recipe) {
  if (!this.canCookMeal(recipe)) {
  const ingredients = this.getItemsNeeded(recipe);
  const deleteIngredientsFetchArray = ingredients.map((ingredient) => {
    console.log(user.id, ingredient.id, ingredient.amountNeeded,  'infoToPostAdd')
    return fetch( 'https://fe-apps.herokuapp.com/api/v1/whats-cookin/1911/users/wcUsersData', {
        method: 'POST',
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          "userID": user.id,
          "ingredientID": ingredient.id,
          "ingredientModification": ingredient.amountNeeded
      })
    }).then(response => response.json())
    .then(json => console.log(json))
    .catch(error => console.log(error.message))

  })
  Promise.all(deleteIngredientsFetchArray).then(promises => {
      alert('Ingredients Added');
    }).catch(error => console.log(error.message)) ;
}
 else {
  alert('You already have enough ingredients to cook this meal!')
}
}

}


export default Pantry;
