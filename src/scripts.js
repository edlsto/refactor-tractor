import './css/base.scss';
import $ from 'jquery';

import Pantry from './pantry';
import Recipe from './recipe';
import User from './user';
import Cookbook from './cookbook';
import domUpdates from './domUpdates';

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
  domUpdates.onStartup(cookbook, cookbook.recipes, ingredients.ingredientsData, users)
  // greetUser();
}).catch(error => console.log(error.message));


let favButton = $('.view-favorites');
let homeButton = $('.home')
let cardArea = $('.all-cards');
let headerSearch = $('#search-input');
let searchText = headerSearch.val();
let viewToCookButton = $('#view-to-cook-button');

headerSearch.on('keyup', () => domUpdates.searchByName(cookbook))
homeButton.on('click', domUpdates.cardButtonConditionals);
favButton.on('click', domUpdates.viewFavorites);
cardArea.on('click', () => domUpdates.cardButtonConditionals(cookbook));
cardArea.on('click', () => {
	if ($(event.target).hasClass('close-btn')) {
		domUpdates.closeRecipe(cookbook)
	}
})
