// domUpdates.js

import Pantry from './pantry';
import Recipe from './recipe';
import User from './user';
import Cookbook from './cookbook';
import $ from 'jquery';

let ingredientData
let ingredientsData
let users
let ingredientsArchive = [];
let cookbook;
let cookbookArchive = [];
let user, pantry;


let favButton = $('.view-favorites');
let homeButton = $('.home')
let cardArea = $('.all-cards');
let headerSearch = $('#search-input');
let searchText = headerSearch.val();
let viewToCookButton = $('#view-to-cook-button');

let domUpdates = {

	updateRecipesToCook(event, cookbook, user) {
		console.log(cookbook);
		let specificRecipe = cookbook.recipes.find(recipe => {
			console.log(event.target.id);
			return recipe.id  === Number(event.target.id)

			// console.log(favoriteRecipes);
		})
		if (!$(event.target).hasClass('add-active')) {
			$(event.target).addClass('add-active');
			user.addRecipesToCook(specificRecipe);
		} else if ($(event.target).hasClass('add-active')) {
			$(event.target).removeClass('add-active');
			user.removeFromRecipesToCook(specificRecipe);
		}
	},

	 getRecipesToCook(user) {
  if (user.recipesToCook.length) {
    user.recipesToCook.forEach(recipe => {
		console.log(`.add${recipe.id}`);
      $(`.add${recipe.id}`).addClass('add-active')
    })
  } else return
},


	populateCards(recipes, user) {
	  cardArea.html('');
	  if (cardArea.hasClass('all')) {
	    cardArea.removeClass('all')
	  }
		if (user) {
		user.recipesToCook
		}
	  recipes.forEach(recipe => {
	    cardArea.prepend(`<div id='${recipe.id}'
	    class='card'>
	        <header id='${recipe.id}' class='card-header'>
	          <label for='add-button' class='hidden'>Click to add recipe</label>
	          <button id='${recipe.id}' aria-label='add-button' class='add-button card-button'>
	            <img id='${recipe.id}' class='add'
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
			console.log(recipe.id)
			if (user) {
			console.log(
			user.recipesToCook
			)
		}
	  })
	  this.getFavorites(user);
		this.getRecipesToCook(user);

	},

	getFavorites(user) {
	  if (user.favoriteRecipes.length) {
	    user.favoriteRecipes.forEach(recipe => {
	      $(`.favorite${recipe.id}`).addClass('favorite-active')
	    })
	  } else return
	},

	greetUser(user) {
	  const userName = $('.user-name');
	  userName.html(user.name.split(' ')[0] + ' ' + user.name.split(' ')[1][0]);
	},

	searchByName(cookbook, user) {
	  let results = cookbook.findRecipeByName(headerSearch.val())
	  if(results !== undefined) {
	    this.populateCards(results, user)
	  }
	},

	closeRecipe(cookbook) {
		this.populateCards(cookbook.recipes)
		cardArea.removeClass('display-recipe');
		cardArea.addClass('all-cards')
	},

	displayDirections(event, cookbook, pantry, ingredientsArchive) {
		console.log(ingredientsArchive)
	  let newRecipeInfo = cookbook.recipes.find(recipe => {
	    if (recipe.id === Number(event.target.id)) {
	      return recipe;
	    }
	  })
	  let recipeObject = new Recipe(newRecipeInfo, ingredientsArchive);
		console.log(recipeObject)
	  let cost = recipeObject.calculateCost()
	  let costInDollars = (cost / 100).toFixed(2);
		cardArea.add('all')
		cardArea.addClass('display-recipe');
		cardArea.removeClass('all-cards')
		let cookability = pantry.canCookMeal(newRecipeInfo) ? 'can' : 'can\'t'

	  cardArea.html(`
			<div class="close-btn-wrapper"><div class="close-btn">Close recipe</div></div>
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
		</div>`);
		let alert = $('.alert')
		const upperCase = (word) => {
			let letters = word.split('');
			letters[0] = letters[0].toUpperCase();
			return letters.join('')
		}
		if (!pantry.canCookMeal(newRecipeInfo)) {
			alert.addClass('alert-cant-cook');
			alert.append(`<div class="you-will-need"><h3>You will need (total cost of $${(pantry.getCostOfItemsNeeded(newRecipeInfo)/100).toFixed(2)}): </h3></div>`)
			pantry.getItemsNeeded(newRecipeInfo).forEach(item => {
				$('.alert').append(`<div class="shopping-list"><p>${upperCase(item.name)} (${Math.round(item.amountNeeded * 100) / 100} ${item.unit}, at a cost of $${(item.costOfWhatsNeededInCents/100).toFixed(2)})</p></div>`)
			});
		}
	  let ingredientsSpan = $('.ingredients');
	  let instructionsSpan = $('.instructions');
	  recipeObject.ingredients.forEach(ingredient => {
	    ingredientsSpan.prepend( `<ul><li>
	    ${ingredient.quantity.amount.toFixed(2)} ${ingredient.quantity.unit}
	    ${ingredientsArchive.find(item => {
	      return item.id === ingredient.id
	    }).name}</li></ul>`)
	  })
	  recipeObject.instructions.forEach(instruction => {
	    instructionsSpan.before(`<li>
	    ${instruction.instruction}</li>
	    `)
	  })
	},

 favoriteCard(event, cookbook, user) {
	 console.log(user)
	  let specificRecipe = cookbook.recipes.find(recipe => {
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
	  if (cardArea.hasClass('all')) {
	    cardArea.removeClass('all')
	  }
	  if (!user.favoriteRecipes.length) {
	    favButton.html('You have no favorites!');
	    this.populateCards(cookbook.recipes);
	    return
	  } else {
	    favButton.html('Refresh Favorites');
	    cardArea.html('');
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
	cardButtonConditionals(cookbook, user, pantry, ingredientsArchive) {
		if(!event) {
			this.populateCards(cookbook.recipes, user)
		} else if ($(event.target).hasClass('favorite')) {
			this.favoriteCard(event, cookbook, user);
		} else if ($(event.target).hasClass('card-picture')) {

			this.displayDirections(event, cookbook, pantry, ingredientsArchive);
		} else if ($(event.target).hasClass('home')) {
			favButton.html('View Favorites');
			domUpdates.populateCards(cookbook.recipes, user)
		} else if ($(event.target).hasClass('add')) {
		this.updateRecipesToCook(event, cookbook, user);
		// addActiveToAddButton(event);
	}
	},

	viewRecipesToCook(event, user) {
		console.log(user)
	if (cardArea.hasClass('all')) {
    cardArea.removeClass('all')
  }
	if (!user.recipesToCook.length) {
		viewToCookButton.html('You have no recipes to cook!');
		populateCards(cookbook.recipes);
		return
	} else {
		viewToCookButton.html('Refresh Recipes to Cook');
		cardArea.html('');
		console.log(user.recipesToCook);
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
