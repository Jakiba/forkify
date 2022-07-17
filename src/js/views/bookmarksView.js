import View from './View';
import previewView from './previewView';

/**
 * Child Class of the View Class. Generates the bookmarksView.
 */
class BookmarksView extends View {
  _parentElement = document.querySelector('.bookmarks__list');
  _errorMessage = 'No bookmarks yet. Find a nice recipe and bookmark it :)';
  _successMessage = '';

  /**
   *(Publisher-Subscriber-Pattern) This Publisher gets the necessary data from controller.js (Subscriber --> controlRecipes) to pass into the event listener function. When 'load' event is triggered, calls the handlerFunction, which then renders the bookmarks.
   * @param {function} handlerFunction controller.js function to pass in to get necessary data from model.js.
   * @returns {undefined}
   */
  addHandlerRender(handlerFunction) {
    window.addEventListener('load', handlerFunction);
  }

  /**
   * Generates markup for booksmarksView.
   * @returns {string} markup
   * @this {object} class that calls this '_generateMarkup' method.
   */
  _generateMarkup() {
    return this._data
      .map(bookmark => previewView.render(bookmark, false))
      .join('');
  }
}

export default new BookmarksView();
