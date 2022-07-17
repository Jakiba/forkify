import * as model from './model.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultsView from './views/resultsView.js';
import paginationView from './views/paginationView.js';
import bookmarksView from './views/bookmarksView.js';
import addRecipeView from './views/addRecipeView.js';
import { MODAL_CLOSE_SEC } from './config.js';

import 'core-js/stable';
import 'regenerator-runtime/runtime';

/**
 * takes the id of the current page (string after #) and checks if there is one or not (guard clause). Then the spinner gets rendered for the recipeView as long as the img hasnt loaded. Updates resultsView and bookmarksView (with update()-method from view.js). Then loadRecipe with the id as argument is executed (sets recipe with that id as 'state.recipe'). The recipeView is then rendered with 'model.state.recipe' as argument. If an error occurs in the functions that are in the model.js or one of the view.js files, the error is rethrown and propagated down to this function, where it gets rendered to the recipeView with 'renderErrorMessage(message = hasDefault)'.
 * @returns {undefined}
 */
const controlRecipes = async function () {
  try {
    const id = window.location.hash.slice(1);

    if (!id) return;

    recipeView.renderSpinner();

    resultsView.update(model.getSearchResultsPage());
    bookmarksView.update(model.state.bookmarks);

    await model.loadRecipe(id);

    recipeView.render(model.state.recipe);
  } catch (err) {
    recipeView.renderErrorMessage();
  }
};

/**
 * Responsible for the executing methods from model.js and sthView.js files that have something to do with the SearchResults that get rendered, after a user searches for a recipe. For the resultsView the spinner gets rendered, query gets saved (to check with guard clause if undefined) and then passed in into 'loadSearchResults' to get the search results which then get rendered with 'getSearchResultsPage(page = state.search.page)'. Finally the pagination-elements get rendered!
 * @returns {undefined}
 */
const controlSearchResults = async function () {
  try {
    resultsView.renderSpinner();
    const query = searchView.getQuery();
    if (!query) return;
    await model.loadSearchResults(query);
    resultsView.render(model.getSearchResultsPage());
    paginationView.render(model.state.search);
  } catch (err) {
    console.log(err);
  }
};

/**
 * (Publisher-Subscriber-Pattern) This Subscriber gets the necessary data from model.js to control the 'addHandlerClick' function in paginationView.js (Publisher)! It renders the results of the passed in number (page). Then the paginationView is rendered (render()).
 * @param {number | undefined} goToPage to which page it should go when recipes are loaded (default is page 1 --> 'getSearchResults').
 * @returns {undefined}
 */
const controlPagination = function (goToPage) {
  resultsView.render(model.getSearchResultsPage(goToPage));
  paginationView.render(model.state.search);
};

/**
 * (Publisher-Subscriber-Pattern) This Subscriber gets the necessary data from model.js to control the 'addHandlerUpdateServings' function in recipeView.js (Publisher)! The new quantity for each ingredient is calculated with 'updateServings(newServings)'. Then we update the recipeView with 'update()'.
 * @param {number} newServings bascially 'updateTo'. The new servings number.
 * @returns {undefined}
 */
const controlServings = function (newServings) {
  model.updateServings(newServings);
  recipeView.update(model.state.recipe);
};

/**
 * (Publisher-Subscriber-Pattern) This Subscriber gets the necessary data from model.js to control the 'addHandlerAddBookmark' function in recipeView.js (Publisher)! if recipe is not bookmarked, bookmark it, otherwise delete bookmark. Then update the recipeView and render (or rerender) the bookmarksView.
 * @returns {undefined}
 */
const controlAddBookmark = function () {
  if (!model.state.recipe.bookmarked) model.addBookmark(model.state.recipe);
  else model.deleteBookmark(model.state.recipe.id);
  recipeView.update(model.state.recipe);
  bookmarksView.render(model.state.bookmarks);
};

/**
 * (Publisher-Subscriber-Pattern) This Subscriber gets the necessary data from model.js to control the 'addHandlerRender' function in bookmarksView.js (Publisher)! For directly rendering the bookmarks on page load, so that the update()-method doesnt throw an error because of the local storage data.
 * @returns {undefined}
 */
const controlBookmarks = function () {
  bookmarksView.render(model.state.bookmarks);
};

/**
 * (Publisher-Subscriber-Pattern) This Subscriber gets the necessary data from model.js to control the 'addHandlerUpload' function in addRecipeView.js (Publisher)! Render spinner to show user that recipe is getting uploaded. Upload the recipe using 'uploadRecipe'-method, then (when succesfully uploaded) render success message (with timeout), render the uplaoded recipe, bookmark it and rerender the bookmarksView. Now we change the id in current url to id of new rendered recipe and close the 'add recipe'-form.
 * @param {object} newRecipe the recipe the user wants to upload.
 * @returns {undefined}
 */
const controlAddRecipe = async function (newRecipe) {
  try {
    addRecipeView.renderSpinner();
    await model.uplaodRecipe(newRecipe);
    console.log(model.state.recipe);
    recipeView.render(model.state.recipe);
    addRecipeView.renderSuccessMessage();
    bookmarksView.render(model.state.bookmarks);
    window.history.pushState(null, '', `#${model.state.recipe.id}`);
    setTimeout(function () {
      addRecipeView.toggleWindow();
    }, MODAL_CLOSE_SEC * 1000);
  } catch (err) {
    console.error('🔥🔥🔥', err);
    addRecipeView.renderErrorMessage(err.message);
  }
};

/**
 * MOST IMPORTANT FUNCTION in controller.js, which is responsible for calling all Publisher to pass in the Subscriber as argument, so that all Functinos/Methods are executed.
 * @returns {undefined}
 */
const init = function () {
  bookmarksView.addHandlerRender(controlBookmarks);
  recipeView.addHandlerRender(controlRecipes);
  recipeView.addHandlerUpdateServings(controlServings);
  recipeView.addHandlerAddBookmark(controlAddBookmark);
  searchView.addHandlerSearch(controlSearchResults);
  paginationView.addHandlerClick(controlPagination);
  addRecipeView.addHandlerUpload(controlAddRecipe);
};
init();
