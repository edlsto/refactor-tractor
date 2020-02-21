import './css/base.scss';
import $ from 'jquery';

import Pantry from './pantry';
import Recipe from './recipe';
import User from './user';
import Cookbook from './cookbook';

let ingredientData
let ingredientsData
let users
let ingredientsArchive = [];
let cookbook;
let cookbookArchive = [];
let user, pantry;

function getData(type) {
	const root = 'https://fe-apps.herokuapp.com/api/v1/whats-cookin/1911/';
	const url = `${root}${type}`;
	const promise = fetch(url)
	                .then(data => data.json());
	return promise;
}
// to do; refactor this so it isn't living in global scope
let recipes = getData('recipes/recipeData');
let ingredients = getData('ingredients/ingredientsData');
let userss = getData('users/wcUsersData');

Promise.all([recipes, ingredients, userss]).then(promises => {
  recipes = promises[0];
  ingredients = promises[1];
  userss = promises[2];
}).then(() => {
  users = userss.wcUsersData
  cookbook = new Cookbook(recipes.recipeData);
  onStartup(cookbook, cookbook.recipes, ingredients.ingredientsData, users)
  // greetUser();
}).catch(error => console.log(error.message));


let favButton = $('.view-favorites');
let homeButton = $('.home')
let cardArea = $('.all-cards');
let headerSearch = $('#search-input');
let searchText = headerSearch.val();
let viewToCookButton = $('#view-to-cook-button');

headerSearch.on('keyup', () =>  searchByName())
homeButton.on('click', cardButtonConditionals);
favButton.on('click', viewFavorites);
cardArea.on('click', cardButtonConditionals);

function onStartup(cookbook, recipeData, ingredientData, users) {
  let userId = (Math.floor(Math.random() * 49) + 1)
  let newUser = users.find(user => {
    return user.id === Number(userId);
  });
  user = new User(userId, newUser.name, newUser.pantry)
  pantry = new Pantry(newUser.pantry)
  cookbook.recipes = cookbook.recipes.map((recipe) => {
    return new Recipe(recipe)
  })
  populateCards(recipeData);
  greetUser();
  ingredientsArchive = ingredientData;
  cookbookArchive = cookbook;
  searchByName()
}

function searchByName() {
  let results = cookbook.findRecipeByName(headerSearch.val())
  if(results !== undefined) {
    populateCards(results)
  }
}

function viewFavorites() {
  if (cardArea.hasClass('all')) {
    cardArea.removeClass('all')
  }
  if (!user.favoriteRecipes.length) {
    favButton.html('You have no favorites!');
    populateCards(cookbook.recipes);
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
}

function greetUser() {
  const userName = $('.user-name');
  userName.html(user.name.split(' ')[0] + ' ' + user.name.split(' ')[1][0]);
}

function favoriteCard(event) {
	// debugger
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
}

function updateRecipesToCook(event) {
	debugger
	let specificRecipe = cookbook.recipes.find(recipe => {
		if (recipe.id  === Number(event.target.id)) {
			return recipe;
		}
	})
	if (!$(event.target).hasClass('add-active')) {
		$(event.target).addClass('add-active');
		user.addRecipesToCook(specificRecipe);
	} else if ($(event.target).hasClass('add-active')) {
		$(event.target).removeClass('add-active');
		user.removeFromRecipesToCook(specificRecipe)
	}
}

function cardButtonConditionals(event) {
	debugger
  if ($(event.target).hasClass('favorite')) {
    favoriteCard(event);
  } else if ($(event.target).hasClass('card-picture')) {
    displayDirections(event);
  } else if ($(event.target).hasClass('home')) {
    favButton.html('View Favorites');
    populateCards(cookbook.recipes);
  } else if ($(event.target).hasClass('add')) {
		updateRecipesToCook(event);
	}
}



function displayDirections(event) {
  let newRecipeInfo = cookbook.recipes.find(recipe => {
    if (recipe.id === Number(event.target.id)) {
      return recipe;
    }
  })
  let recipeObject = new Recipe(newRecipeInfo, ingredientsArchive);
  let cost = recipeObject.calculateCost()
  let costInDollars = (cost / 100).toFixed(2)
  cardArea.add('all');
  cardArea.html(`<h3>${recipeObject.name}</h3>
  <p class='all-recipe-info'>
  <strong>It will cost: </strong><span class='cost recipe-info'>
  $${costInDollars}</span><br><br>
  <strong>You will need: </strong><span class='ingredients recipe-info'></span>
  <strong>Instructions: </strong><ol><span class='instructions recipe-info'>
  </span></ol>
  </p>`);
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
}

function getFavorites() {
  if (user.favoriteRecipes.length) {
    user.favoriteRecipes.forEach(recipe => {
      $(`.favorite${recipe.id}`).addClass('favorite-active')
    })
  } else return
}

function populateCards(recipes) {
  cardArea.html('');
  if (cardArea.hasClass('all')) {
    cardArea.removeClass('all')
  }
  recipes.forEach(recipe => {
    cardArea.prepend(`<div id='${recipe.id}'
    class='card'>
        <header id='${recipe.id}' class='card-header'>
          <label for='add-button' class='hidden'>Click to add recipe</label>
          <button id='${recipe.id}' aria-label='add-button' class='add-button card-button'>
            <img id='${recipe.id} favorite' class='add'
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
  getFavorites();
};
