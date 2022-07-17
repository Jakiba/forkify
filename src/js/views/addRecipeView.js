import View from './View';

/**
 * Child Class of the View Class. Generates markup for generating the addRecipe-Overlay when clicking on 'ADD RECIPE'.
 */
class AddRecipeView extends View {
  _parentElement = document.querySelector('.upload');
  _successMessage = 'Recipe was successfully uploaded!';

  _window = document.querySelector('.add-recipe-window');
  _overlay = document.querySelector('.overlay');
  _btnOpen = document.querySelector('.nav__btn--add-recipe');
  _btnClose = document.querySelector('.btn--close-modal');

  //to run the methods in this class.
  constructor() {
    super();
    this._addHandlerShowWindow();
    this._addHandlerHideWindow();
  }

  //refactored code to new method to bind the 'this' keyword in event listener below.
  toggleWindow() {
    this._overlay.classList.toggle('hidden');
    this._window.classList.toggle('hidden');
  }

  //open modal(overlay)!
  _addHandlerShowWindow() {
    this._btnOpen.addEventListener('click', this.toggleWindow.bind(this));
  }

  //close model(overlay)
  _addHandlerHideWindow() {
    this._btnClose.addEventListener('click', this.toggleWindow.bind(this));
    this._overlay.addEventListener('click', this.toggleWindow.bind(this));
  }

  /**
   *(Publisher-Subscriber-Pattern) This Publisher gets the necessary data from controller.js (Subscriber --> controlAddRecipe) to pass into the event listener function. When 'submit' event is triggered, calls the handlerFunction and uploads recipe to api.
   * @param {function} handlerFunction controller.js function to pass in to get necessary data from model.js.
   * @returns {undefined}
   */
  addHandlerUpload(handlerFunction) {
    this._parentElement.addEventListener('submit', function (e) {
      e.preventDefault();

      const dataArr = [...new FormData(this)];
      const dataObject = Object.fromEntries(dataArr);
      handlerFunction(dataObject);
    });
  }

  //markup as always...
  _generateMarkup() {}
}

export default new AddRecipeView();
