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
	  let userId = (Math.floor(Math.random() * 49) + 1)
	  let newUser = users.find(user => {
	    return user.id === Number(userId);
	  });
	  const user = new User(userId, newUser.name, newUser.pantry, recipes, ingredients)
	  domUpdates.populateCards(user);
	  domUpdates.greetUser(user);

		//Event listeners
		headerSearch.on('keyup', () => domUpdates.searchByName(user))
		cardArea.on('click', () => domUpdates.cardButtonConditionals(event, user));
		homeButton.on('click', () => {
			favButton.html('View Favorites');
			domUpdates.populateCards(user)
		})
		favButton.on('click', () => domUpdates.viewFavorites(user));
		cardArea.on('click', () => {
			if ($(event.target).hasClass('close-btn')) {
				domUpdates.closeRecipe(user)
			}
		});
		viewToCookButton.on('click', () => domUpdates.viewRecipesToCook(event, user));

	}
