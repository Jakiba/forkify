import View from './View';
import icons from 'url:../../img/icons.svg';

/**
 * Child Class of the View Class. Generates markup for booksmarkView and resultsView.
 */
class PreviewView extends View {
  _parentElement = '';

  /**
   * Responsible for generating the general markup for booksmarkView and resultsView, which gets rendered if the 'render' method is called with a second argument of 'false'!
   * @returns {string} html markup.
   * @this {object} class that calls this '_generateMarkup' method.
   */
  _generateMarkup() {
    const id = window.location.hash.slice(1);

    return `
    <li class="preview">
      <a class="preview__link ${
        this._data.id === id ? `preview__link--active` : ''
      }" href="#${this._data.id}">
        <figure class="preview__fig">
          <img src="${this._data.image}" alt="${this._data.title}" />
        </figure>
        <div class="preview__data">
          <h4 class="preview__title">${this._data.title}</h4>
          <p class="preview__publisher">${this._data.publisher}</p>
          <div class="preview__user-generated ${
            this._data.key ? '' : 'hidden'
          }">
           <svg>
            <use href="${icons}#icon-user"></use>
           </svg>
          </div>
        </div>
      </a>
    </li>
    `;
  }
}

export default new PreviewView();
