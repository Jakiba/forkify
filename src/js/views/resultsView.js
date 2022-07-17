import View from './View';
import previewView from './previewView';

/**
 * Child Class of the View Class. Generates markup for the search results.
 */
class ResultsView extends View {
  _parentElement = document.querySelector('.results');
  _errorMessage = 'No recipes found for your query! Please try again :)';
  _successMessage = '';

  /**
   * Generates markup for search results.
   * @returns {string}
   */
  _generateMarkup() {
    return this._data.map(result => previewView.render(result, false)).join('');
  }
}

export default new ResultsView();
