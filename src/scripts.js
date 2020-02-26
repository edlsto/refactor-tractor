import './css/base.scss';
import $ from 'jquery';

import Pantry from './pantry';
import Recipe from './recipe';
import User from './user';
import Cookbook from './cookbook';
import domUpdates from './domUpdates';

let favButton = $('.view-favorites');
let homeButton = $('.home')
let cardArea = $('.all-cards');
let headerSearch = $('#search-input');
let searchText = headerSearch.val();
let viewToCookButton = $('#view-to-cook-button');
let recipes = getData('recipes/recipeData');
let ingredients = getData('ingredients/ingredientsData');
let userss = getData('users/wcUsersData');
let postButton = $('.post-button');
let deleteButton = $('.delete-button');
let checklist = $('#checklist')

Promise.all([recipes, ingredients, userss]).then(promises => {
  recipes = promises[0];
  ingredients = promises[1];
  userss = promises[2];
  const users = userss.wcUsersData
  onStartup(recipes, ingredients, users)
}).catch(error => console.log(error.message));

function getData(type) {
	const root = 'https://fe-apps.herokuapp.com/api/v1/whats-cookin/1911/';
	const url = `${root}${type}`;
	const promise = fetch(url)
	  .then(data => data.json());
	return promise;
}

function onStartup(recipes, ingredients, users) {
	  let userId = (Math.floor(Math.random() * 49) + 1);
	  let newUser = users.find(user => {
	    return user.id === Number(userId);
	  });
	  const user = new User(userId, newUser.name, newUser.pantry, recipes, ingredients)
	  user.populateCards();
	  domUpdates.greetUser(user);

		//Event listeners
		headerSearch.on('keyup', () => user.searchByName())
		cardArea.on('click keypress', () => domUpdates.cardButtonConditionals(event, user));
		homeButton.on('click', () => {
			favButton.html('View Favorites');
			user.populateCards()
		})
		favButton.on('click', () => user.viewFavorites());


    checklist.on('click', () => {
      let selected = [];
      $('#checklist input:checked').each(function() {
        selected.push($(this).attr('name'));
      });
      user.filterRecipes(selected)
    })
		cardArea.on('click', () => {
			if ($(event.target).hasClass('close-btn')) {
				domUpdates.closeRecipe(user)
			}
      if ($(event.target).hasClass('delete-button')) {
        const recipeId = $(event.target).parent().prev().prev()[0].id;
        const currentRecipe = user.cookbook.recipes.find(recipe => {
          return recipe.id === Number(recipeId);
        })
				user.pantry.deleteIngredients(user, currentRecipe);
			}
      if ($(event.target).hasClass('post-button')) {
        const recipeId = $(event.target).parent().prev().prev()[0].id;
        const currentRecipe = user.cookbook.recipes.find(recipe => {
          return recipe.id === Number(recipeId);
        })
				user.pantry.addIngredients(user, currentRecipe);
			}
		});
		viewToCookButton.on('click', () => user.viewRecipesToCook(event));
	}
