import Recipe from './recipe';
import $ from 'jquery';

let domUpdates = {

  updateRecipesToCook(target, user) {
    let specificRecipe = user.cookbook.recipes.find(recipe => {
      return recipe.id  === Number(target.id)
    })
    if (!$(target).hasClass('add-active')) {
      $(target).addClass('add-active');
      user.addRecipesToCook(specificRecipe);
    } else if ($(target).hasClass('add-active')) {
      $(target).removeClass('add-active');
      user.removeFromRecipesToCook(specificRecipe);
    }
  },

  getRecipesToCook(user) {
    if (user.recipesToCook.length) {
      user.recipesToCook.forEach(recipe => {
        $(`.add${recipe.id}`).addClass('add-active')
      })
    } else {
      return
    }
  },

  getFavorites(user) {
    if (user.favoriteRecipes.length) {
      user.favoriteRecipes.forEach(recipe => {
        $(`.favorite${recipe.id}`).addClass('favorite-active')
      })
    } else {
      return
    }
  },

  populateCards(user, recipes = user.cookbook.recipes) {
    let cardArea = $('.card-section');
    cardArea.html('');
    cardArea.removeClass('display-recipe');
    cardArea.addClass('all-cards')
    if (cardArea.hasClass('all')) {
      cardArea.removeClass('all')
    }
    recipes.forEach(recipe => {
      cardArea.prepend(`<div id='${recipe.id}'
      class='card'>
          <header id='${recipe.id}' class='card-header'>
            <label for='add-button' class='hidden'>Click to add recipe</label>
            <button id='${recipe.id}' aria-label='add-button' class='add-button card-button'>
              <img id='${recipe.id}' class='add  add${recipe.id}'
              src='https://image.flaticon.com/icons/svg/32/32339.svg' alt='Add to
              recipes to cook'>
            </button>
            <label for='favorite-button' class='hidden'>Click to favorite recipe
            </label>
            <button id='${recipe.id}' aria-label='favorite-button' class='favorite favorite${recipe.id} card-button'></button>
          </header>
            <span id='${recipe.id}' class='recipe-name'>${recipe.name}</span>
            <img id='${recipe.id}' tabindex='0' class='card-picture'
            src='${recipe.image}' alt='click to view recipe for ${recipe.name}'>
      </div>`)
    })
    this.getFavorites(user);
    this.getRecipesToCook(user);
  },



  greetUser(user) {
    const userName = $('.user-name');
    userName.html(user.name.split(' ')[0] + ' ' + user.name.split(' ')[1][0]);
  },

  searchByName(user) {
    let headerSearch = $('#search-input');
    let cardArea = $('.all-cards');
    let results = user.findRecipeByName(headerSearch.val());
    if (cardArea.hasClass('favorites')) {
      results = user.findFavorites(headerSearch.val());
    } else if (cardArea.hasClass('to-cook')) {
      results = user.findRecipeToCook(headerSearch.val());
    }
    if (!headerSearch.val()) {
      this.populateCards(user);
    }
    this.populateCards(user, results)
  },

  closeRecipe(user) {
    let cardArea = $('.display-recipe');
    cardArea.removeClass('display-recipe');
    cardArea.addClass('all-cards');
    this.populateCards(user);
  },

  filterRecipes(user, selected) {
    let cardArea = $('.all-cards');
    let recipesToFilter = user.cookbook.recipes;
    if (cardArea.hasClass('favorites')) {
      recipesToFilter = user.favoriteRecipes
    } else if (cardArea.hasClass('to-cook')) {
      recipesToFilter = user.recipesToCook;
    }
    if (selected.length === 0) {
      this.populateCards(user, recipesToFilter)
      return
    }
    const filteredRecipes = recipesToFilter.filter(recipe => {
      return recipe.tags.find(tag => {
        return selected.includes(tag)
      })
    })
    if (filteredRecipes.length) {
      this.populateCards(user, filteredRecipes)
    } else if ((cardArea.hasClass('favorites') || cardArea.hasClass('to-cook')) && !filteredRecipes.length) {
      this.populateCards(user, []);
    } else {
      this.populateCards(user)
    }
  },

  displayDirections(event, user) {
    let cardArea = $('.all-cards');
    let newRecipeInfo = user.cookbook.recipes.find(recipe => {
      if (recipe.id === Number(event.target.id)) {
        return recipe;
      }
    })
    let recipeObject = new Recipe(newRecipeInfo, user.pantry.ingredientsData);
    let cost = recipeObject.calculateCost()
    let costInDollars = (cost / 100).toFixed(2);
    cardArea.add('all')
    cardArea.addClass('display-recipe');
    cardArea.removeClass('all-cards')
    let cookability = user.pantry.canCookMeal(newRecipeInfo) ? 'can' : 'can\'t'

    cardArea.html(`
      <div class="close-btn-wrapper"><button class="close-btn" role="exit-recipe" tabindex='1'>Close recipe</button></div>
      <div class="alert"><div class="can-or-cant-cook"><h3>You ${cookability} cook this meal, based on what's on your pantry!</h3></div>
    </div>

    <div class="recipe-title-container"><h3>${recipeObject.name}</h3>
      <p class="total-cost">Total cost of this recipe: <span class='cost recipe-info'>
      $${costInDollars}</p>
      </div>
      <img id='${recipeObject.id}' tabindex='0' class='recipe-picture'
      src='${recipeObject.image}' alt='click to view recipe for ${recipeObject.name}'>

    <div class='all-recipe-info'>
      <div class="recipe-ingredients-needed">
      <p>You will need: </p><span class='ingredients recipe-info'></span>
      </div>
      <div class="recipe-instructions">
      <p>Instructions: </p><ol><span class='instructions recipe-info'>
      </span></ol>
      </div>
    </div>

    <div class='post-delete-buttons'>
   <button id= aria-label='post-button' class='post-button'>'get-ingredients'</button>
   <button id= aria-label='delete-button' class='delete-button'> 'cook-recipe' </button>
   </div>
    `);
    let alert = $('.alert')
    const upperCase = (word) => {
      let letters = word.split('');
      letters[0] = letters[0].toUpperCase();
      return letters.join('')
    }
    if (!user.pantry.canCookMeal(newRecipeInfo)) {
      alert.addClass('alert-cant-cook');
      alert.append(`<div class="you-will-need"><h3>You will need (total cost of $${(user.pantry.getCostOfItemsNeeded(newRecipeInfo) / 100).toFixed(2)}): </h3></div>`)
      user.pantry.getItemsNeeded(newRecipeInfo).forEach(item => {
        $('.alert').append(`<div class="shopping-list"><p>${upperCase(item.name)} (${Math.round(item.amountNeeded * 100) / 100} ${item.unit}, at a cost of $${(item.costOfWhatsNeededInCents / 100).toFixed(2)})</p></div>`)
      });
    }
    let ingredientsSpan = $('.ingredients');
    let instructionsSpan = $('.instructions');
    recipeObject.ingredients.forEach(ingredient => {
      ingredientsSpan.prepend( `<ul><li>
      ${ingredient.quantity.amount.toFixed(2)} ${ingredient.quantity.unit}
      ${user.pantry.ingredientsData.find(item => {
        return item.id === ingredient.id
      }).name}</li></ul>`)
    })
    recipeObject.instructions.forEach(instruction => {
      instructionsSpan.before(`<li>
      ${instruction.instruction}</li>
      `)
    })
  },

  favoriteCard(event, user) {
    let favButton = $('.view-favorites');
    let specificRecipe = user.cookbook.recipes.find(recipe => {
      if (recipe.id  === Number(event.target.id)) {
        return recipe;
      }
    })
    if (!$(event.target).hasClass('favorite-active')) {
      $(event.target).addClass('favorite-active');
      favButton.html('View Favorites');
      user.addToFavorites(specificRecipe);
    } else if ($(event.target).hasClass('favorite-active')) {
      $(event.target).removeClass('favorite-active');
      user.removeFromFavorites(specificRecipe)
    }
  },



  viewFavorites(user) {
    let favButton = $('.view-favorites');
    let cardArea = $('.all-cards');
    if (cardArea.hasClass('all')) {
      cardArea.removeClass('all')
    }
    if (!user.favoriteRecipes.length) {
      favButton.html('You have no favorites!');
      this.populateCards(user);
      return
    } else {
      favButton.html('Refresh Favorites');
      cardArea.html('');
      cardArea.addClass('favorites');
      user.favoriteRecipes.forEach(recipe => {
        cardArea.prepend(`<div id='${recipe.id}'
        class='card'>
        <header id='${recipe.id}' class='card-header'>
        <label for='add-button' class='hidden'>Click to add recipe</label>
        <button id='${recipe.id}' aria-label='add-button' class='add-button card-button'>
        <img id='${recipe.id}' class='add'
        src='https://image.flaticon.com/icons/svg/32/32339.svg' alt='Add to
        recipes to cook'></button>
        <label for='favorite-button' class='hidden'>Click to favorite recipe
        </label>
        <button id='${recipe.id}' aria-label='favorite-button' class='favorite favorite-active card-button'>
        </button></header>
        <span id='${recipe.id}' class='recipe-name'>${recipe.name}</span>
        <img id='${recipe.id}' tabindex='0' class='card-picture'
        src='${recipe.image}' alt='Food from recipe'>
        </div>`)
      })
    }
  },
  cardButtonConditionals(event, user) {
    if (this.checkKeyboardEvent(event) === true) {
      if ($(event.target).hasClass('favorite')) {
        this.favoriteCard(event, user);
      } else if ($(event.target).hasClass('card-picture')) {
        this.displayDirections(event, user);
      } else if ($(event.target).hasClass('add')) {
        this.updateRecipesToCook(event.target, user);
      } else if ($(event.target).hasClass('add-button')) {
        this.updateRecipesToCook($(event.target).children()[0], user);
      }
    }
  },

  checkKeyboardEvent(event) {
    let validated
    if (event.type === 'click') {
      validated = true;
    } else if (event.type === 'keypress') {
      let code = event.charCode || event.keyCode;
      if ((code === 32) || (code === 13)) {
        event.preventDefault();
        validated = true;
      }
    } else {
      validated = false;
    }
    return validated;
  },

  viewRecipesToCook(event, user) {
    let viewToCookButton = $('#view-to-cook-button');
    let cardArea = $('.all-cards');
    if (cardArea.hasClass('all')) {
      cardArea.removeClass('all')
    }
    if (!user.recipesToCook.length) {
      viewToCookButton.html('You have no recipes to cook!');
      this.populateCards(user);
      return
    } else {
      viewToCookButton.html('Refresh Recipes to Cook');
      cardArea.html('');
      cardArea.addClass('to-cook');
      user.recipesToCook.forEach(recipe => {
        cardArea.prepend(`<div id='${recipe.id}'
        class='card'>
        <header id='${recipe.id}' class='card-header'>
        <label for='add-button' class='hidden'>Click to add recipe</label>
        <button id='${recipe.id}' aria-label='add-button' class='add-button card-button'>
        <img id='${recipe.id}' class='add add-active'
        src='https://image.flaticon.com/icons/svg/32/32339.svg' alt='Add to
        recipes to cook'></button>
        <label for='favorite-button' class='hidden'>Click to favorite recipe
        </label>
        <button id='${recipe.id}' aria-label='favorite-button' class='favorite card-button'>
        </button></header>
        <span id='${recipe.id}' class='recipe-name'>${recipe.name}</span>
        <img id='${recipe.id}' tabindex='0' class='card-picture'
        src='${recipe.image}' alt='Food from recipe'>
        </div>`)
      })
    }
  }
};

export default  domUpdates;
