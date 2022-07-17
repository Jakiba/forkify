import View from './View';
import icons from 'url:../../img/icons.svg';
import fracty from 'fracty'; //for fractures (quantity-ingredients).

/**
 * Child Class of the View Class. Generates markup for the recipes, loads recipe img,...
 */
class RecipeView extends View {
  //so that each of the 'views' has this property, which makes it easier to render all stuff!
  _parentElement = document.querySelector('.recipe');
  _errorMessage = 'We could not find that recipe. Please try another one!';
  _successMessage = '';

  /**
   *(Publisher-Subscriber-Pattern) This Publisher gets the necessary data from controller.js (Subscriber --> controlRecipes) to pass into the event listener function. When 'load'/'hashchange' event is triggered, calls the handlerFunction, which then renders the whole recipe.
   * @param {function} handlerFunction controller.js function to pass in to get necessary data from model.js.
   * @returns {undefined}
   */
  addHandlerRender(handlerFunction) {
    ['hashchange', 'load'].forEach(event =>
      window.addEventListener(event, handlerFunction)
    );
  }

  /**
   *(Publisher-Subscriber-Pattern) This Publisher gets the necessary data from controller.js (Subscriber --> controlServings) to pass into the event listener function. When 'click' event is triggered, calls the handlerFunction, which then renders the new quantity values.
   * @param {function} handlerFunction controller.js function to pass in to get necessary data from model.js.
   * @returns {undefined}
   * @this {object} points to RecipeView.
   */
  addHandlerUpdateServings(handlerFunction) {
    this._parentElement.addEventListener('click', function (e) {
      const btn = e.target.closest('.btn--update-servings');
      if (!btn) return;

      const { updateTo } = btn.dataset;
      if (+updateTo > 0) handlerFunction(+updateTo);
    });
  }

  /**
   *(Publisher-Subscriber-Pattern) This Publisher gets the necessary data from controller.js (Subscriber --> controlAddBookmark) to pass into the event listener function. When 'click' event is triggered, calls the handlerFunction, which then adds/deletes bookmark and rerenders bookmarksView. (Uses event delegation to target bookmark-btn)
   * @param {function} handlerFunction controller.js function to pass in to get necessary data from model.js.
   * @returns {undefined}
   * @this {object} points to RecipeView.
   */
  addHandlerAddBookmark(handlerFunction) {
    this._parentElement.addEventListener('click', function (e) {
      const btn = e.target.closest('.btn--bookmark');
      if (!btn) return;
      handlerFunction();
    });
  }

  /**
   * Responsible for generating whole recipeView markup (ingredients, img, title,...).
   * @returns {string} recipeView markup
   * @this {object} points to RecipeView.
   */
  _generateMarkup() {
    //html-css markup for recipe
    return `
    <figure class="recipe__fig">
      <img src="${this._data.image}" alt="${
      this._data.title
    }" class="recipe__img" />
      <h1 class="recipe__title">
        <span>${this._data.title}</span>
      </h1>
    </figure>

    <div class="recipe__details">
      <div class="recipe__info">
        <svg class="recipe__info-icon">
          <use href="${icons}#icon-clock"></use>
        </svg>
        <span class="recipe__info-data recipe__info-data--minutes">${
          this._data.cookingTime
        }</span>
        <span class="recipe__info-text">minutes</span>
      </div>
      <div class="recipe__info">
        <svg class="recipe__info-icon">
          <use href="${icons}#icon-users"></use>
        </svg>
        <span class="recipe__info-data recipe__info-data--people">${
          this._data.servings
        }</span>
        <span class="recipe__info-text">servings</span>

        <div class="recipe__info-buttons">
          <button class="btn--tiny btn--update-servings" data-update-to="${
            this._data.servings - 1
          }">
            <svg>
              <use href="${icons}#icon-minus-circle"></use>
            </svg>
          </button>
          <button class="btn--tiny btn--update-servings" data-update-to="${
            this._data.servings + 1
          }">
            <svg>
              <use href="${icons}#icon-plus-circle"></use>
            </svg>
          </button>
        </div>
       </div>

       <div class="recipe__user-generated ${this._data.key ? '' : 'hidden'}">
         <svg>
          <use href="${icons}#icon-user"></use>
         </svg>
       </div>
       <button class="btn--round btn--bookmark">
          <svg class="">
            <use href="${icons}#icon-bookmark${
      this._data.bookmarked ? '-fill' : ''
    }"></use>
          </svg>
       </button>
      </div>

      <div class="recipe__ingredients">
        <h2 class="heading--2">Recipe ingredients</h2>
        <ul class="recipe__ingredient-list">
          ${this._data.ingredients.map(this._generateMarkupIngredient).join('')}
        </ul>
      </div>

      <div class="recipe__directions">
        <h2 class="heading--2">How to cook it</h2>
        <p class="recipe__directions-text">
          This recipe was carefully designed and tested by
          <span class="recipe__publisher">${
            this._data.publisher
          }</span>. Please check out
          directions at their website.
        </p>
        <a
          class="btn--small recipe__btn"
          href="${this._data.sourceUrl}"
          target="_blank"
        >
          <span>Directions</span>
          <svg class="search__icon">
            <use href="${icons}#icon-arrow-right"></use>
          </svg>
        </a>
      </div>
    `;
  }

  /**
   * Responsible for generating the li-elements for the ul-element in '_generateMarkup'-method (loop over ingredient array and map markup to each element).
   * @param {object} ingredient object for ingredients (with quantity and description).
   * @returns {string} markup for each inrgedient (li-element for ul-element in html)
   */
  //generates html for map-method in '#generateMarkup'
  _generateMarkupIngredient(ingredient) {
    return `
    <li class="recipe__ingredient">
      <svg class="recipe__icon">
       <use href="${icons}#icon-check"></use>
      </svg>
      <div class="recipe__quantity">${
        ingredient.quantity > 0 ? fracty(ingredient.quantity) : ''
      }</div>
      <div class="recipe__description">
       <span class="recipe__unit">${ingredient.unit}</span>
       ${ingredient.description}
      </div>
    </li>
    `;
  }
}

export default new RecipeView();
