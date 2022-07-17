// import { forEach } from 'core-js/core/array';
import { API_URL, RESULTS_PER_PAGE, API_KEY } from './config';
import { AJAX } from './helpers';

export const state = {
  recipe: {},
  search: {
    query: '',
    results: [],
    page: 1,
    resultsPerPage: RESULTS_PER_PAGE,
  },
  bookmarks: [],
};

/**
 * Change property names of recipe Object to simpler names (source_url => sourceUrl) and add key-property if recipe.key exists on the recipe Object (short circuiting)!
 * @param {Object} data AJAX-call to the API which provides the recipe objects!
 * @returns {Object} Returns the new recipe-Object that is used from now on!
 */
const createRecipeObject = function (data) {
  const { recipe } = data.data;
  return {
    id: recipe.id,
    title: recipe.title,
    publisher: recipe.publisher,
    sourceUrl: recipe.source_url,
    image: recipe.image_url,
    servings: recipe.servings,
    cookingTime: recipe.cooking_time,
    ingredients: recipe.ingredients,
    ...(recipe.key && { key: recipe.key }),
  };
};

/**
 * Await recipe-data from forkify-APi (with API-KEY if there is one in the object). Use now the 'createRecipeObject' (with fetched Data) function to create the new recipe Object and store it in 'state.recipe'. Check if there are any recipes in 'state.bookmarks' (Array) that have the same id as the current one. If yes set 'state.recipe.bookmarked' = true, otherwise false! (Important so that we check if a recipe is bookmarked or not and display that!)! We rethrow the error, so that the error propagates down to controller.js and handle it there
 * @param {string} id the id of current loaded page (window.location.hash.slice(1))
 * @returns {undefined}
 */
export const loadRecipe = async function (id) {
  try {
    const data = await AJAX(`${API_URL}${id}?key=${API_KEY}`);
    state.recipe = createRecipeObject(data);
    if (state.bookmarks.some(bookmarked => bookmarked.id === id))
      state.recipe.bookmarked = true;
    else state.recipe.bookmarked = false;
  } catch (err) {
    console.error(`${err} 🔥🔥🔥`);
    throw err;
  }
};

/**
 * Responsible for fetching the data for loading the search results! We first save the passed in query in 'state.search.query' (need it later...). We await the forkify api-url for searching and pass as search query (?search=...) our query in. This returns an object with all search results for that specific query (data.data.recipes). We now map over this Array of objects and return for each object a new object to (again) have simpler property names and save those results in 'state.search.results'. 'state.search.page' = 1, so that we can this in other functions. (if error, gets rethrown to propagate it down to controller.js)
 * @param {string} query value of search bar (what user searches for)
 * @returns {undefined}
 */
export const loadSearchResults = async function (query) {
  try {
    state.search.query = query;
    const data = await AJAX(`${API_URL}?search=${query}&key=${API_KEY}`);
    state.search.results = data.data.recipes.map(recipe => {
      return {
        id: recipe.id,
        title: recipe.title,
        publisher: recipe.publisher,
        image: recipe.image_url,
        ...(recipe.key && { key: recipe.key }),
      };
    });
    state.search.page = 1;
  } catch (err) {
    console.error(`${err} 🔥🔥🔥`);
    throw err;
  }
};

/**
 * Responsible for getting exactly 10 results out of the 'state.search.results' array (We save passed in argument in 'state.search.page' to later display results based on page). We do that using the slice-method, which gets a start and end argument, which we define with 'page' and 'state.search.resultsPerPage' (from config.js).
 * @param {number} page current page
 * @returns {array} includes first 10 elements (recipes) of 'state.search.results'
 */
export const getSearchResultsPage = function (page = state.search.page) {
  state.search.page = page;
  const start = (page - 1) * state.search.resultsPerPage;
  const end = page * state.search.resultsPerPage;
  return state.search.results.slice(start, end);
};

/**
 * Responsible for updating the quantity of ingredient needed for the current displayed recipe, when user increased the servings. For Each ingredient, we multiply its current quantity by (newServings / state.recipe.servings). We save the passed in argument in 'state.recipe.servings'.
 * @param {number} newServings
 * @returns {undefined}
 */
export const updateServings = function (newServings) {
  state.recipe.ingredients.forEach(ing => {
    ing.quantity = ing.quantity * (newServings / state.recipe.servings);
  });
  state.recipe.servings = newServings;
};

/**
 * Responsible for saving bookmarks in local storage, so that user doesnt lose those. We set them with a key of 'bookmarks' and a value of the stringified 'state.bookmarks'
 * @returns {undefined}
 */
const persistBookmarks = function () {
  localStorage.setItem('bookmarks', JSON.stringify(state.bookmarks));
};

/**
 * Responsible for adding new bookmarked recipes to 'state.bookmarks' and then mark the current recipe as bookmarked, by creating new property 'state.bookmarked' and set it to 'true' if id of current recipe is === 'state.recipe.id' (for usage in other functions). Then save updated 'state.bookmarks' array with persistBookmarks function.
 * @param {object} recipe the object of the current recipe where the user sets his bookmark.
 * @returns {undefined}
 */
export const addBookmark = function (recipe) {
  state.bookmarks.push(recipe);
  if (recipe.id === state.recipe.id) state.recipe.bookmarked = true;
  persistBookmarks();
};

/**
 * Responsible for deleting bookmarked recipes from 'state.bookmarks'. With the findIndex method we search for the index of the recipe object in the 'state.bookmarks' array, where the id of that element is equal to the passed in id and then splice this element away. Then we set 'state.recipe.bookmarked' of current recipe to 'false'. Then save updated 'state.bookmarks' array with persistBookmarks function.
 * @param {string} id the object of the current recipe where the user sets his bookmark.
 * @returns {undefined}
 */
export const deleteBookmark = function (id) {
  const index = state.bookmarks.findIndex(el => el.id === id);
  state.bookmarks.splice(index, 1);
  if (id === state.recipe.id) state.recipe.bookmarked = false;
  persistBookmarks();
};

/**
 * Responisble for getting bookmarks out of local storage! We set then 'state.bookmarks' to the parsed item in storage and call the function directly, so that bookmarks are instantly shown, when reloading the page.
 * @returns {undefined}
 */
const init = function () {
  const storage = localStorage.getItem('bookmarks');
  if (storage) state.bookmarks = JSON.parse(storage);
};
init();

/**
 * For clearing all bookmarks if nessecary.
 * @returns {undefined}
 */
const clearBookmarks = function () {
  localStorage.clear('bookmarks');
};
// clearBookmarks();

/**
 * Responsible for checking if typed in recipe from user has correct format, buildiung the new object and uploading recipe to API (with AJAX function from helper.js). This will send a recipe object back, on which we use the 'createRecipeObject' function to change property names and add a bookmark with 'addBookmark' function.
 * @param {object} newRecipe object with all input (title, ingredients,...) from user.
 * @returns {undefined}
 */
export const uplaodRecipe = async function (newRecipe) {
  try {
    const ingredients = Object.entries(newRecipe)
      .filter(entry => entry[0].startsWith('ingredient') && entry[1] !== '')
      .map(ingredient => {
        const ingrdientsArray = ingredient[1]
          .split(',')
          .map(element => element.trim());

        if (ingrdientsArray.length !== 3)
          throw new Error(
            'wrong ingredient format! Please use the correct format :)'
          );
        const [quantity, unit, description] = ingrdientsArray;
        return { quantity: quantity ? +quantity : null, unit, description };
      });

    const recipe = {
      title: newRecipe.title,
      source_url: newRecipe.sourceUrl,
      image_url: newRecipe.image,
      publisher: newRecipe.publisher,
      cooking_time: +newRecipe.cookingTime,
      servings: +newRecipe.servings,
      ingredients,
    };
    const data = await AJAX(`${API_URL}?key=${API_KEY}`, recipe);
    state.recipe = createRecipeObject(data);
    addBookmark(state.recipe);
  } catch (err) {
    throw err;
  }
};
