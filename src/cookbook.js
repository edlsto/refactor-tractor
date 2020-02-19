class Cookbook {
  constructor(data) {
    this.recipes = data;
  }

  findRecipeByName(searchText) {
    return this.recipes.filter(recipe => {
      let recipeName = recipe.name.split(' ');
      recipeName = recipeName.map((word) => {
        return word.slice(0, searchText.length).toLowerCase()
      })
        return recipeName.includes(searchText.toLowerCase())
    })
  }
}

export default Cookbook;
