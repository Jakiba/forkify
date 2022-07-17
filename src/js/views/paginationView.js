import View from './View';
import icons from 'url:../../img/icons.svg';

/**
 * Child Class of the View Class. Generates markup for the pagination buttons.
 */
class PaginationView extends View {
  _parentElement = document.querySelector('.pagination');

  /**
   *(Publisher-Subscriber-Pattern) This Publisher gets the necessary data from controller.js (Subscriber --> controlPagination) to pass into the event listener function. When 'click' event is triggered, calls the handlerFunction, which then renders the pagination buttons.
   * @param {function} handlerFunction controller.js function to pass in to get necessary data from model.js.
   * @returns {undefined}
   */
  //(Publisher) when clicking on pagination buttons!
  addHandlerClick(handlerFunction) {
    this._parentElement.addEventListener('click', function (e) {
      const btn = e.target.closest('.btn--inline');

      if (!btn) return;

      //data-attribute on every button element (in html) for letting the browser know to which page to go know!
      let goToPage = +btn.dataset.goto; //converting to number
      console.log(goToPage);
      console.log(btn);
      handlerFunction(goToPage);
    });
  }

  /**
   * Generates the HTML for the pagination buttons for diffrent scenarios (last page, first page,...), which then gets rendered in the 'render' method in the controller.js (controlPagination).
   * @returns {string} markup for pagination buttons.
   */
  _generateMarkup() {
    const currentPage = this._data.page;
    const numPages = Math.ceil(
      this._data.results.length / this._data.resultsPerPage
    );
    //page 1, there are other pages!
    if (currentPage === 1 && numPages > 1) {
      return `
          <button data-goto="${
            currentPage + 1
          }" class="btn--inline pagination__btn--next">
            <span>Page ${currentPage + 1}</span>
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-right"></use>
            </svg>
          </button>
      `;
    }

    //last page
    if (currentPage === numPages && numPages > 1) {
      return `
          <button data-goto="${
            currentPage - 1
          }" class="btn--inline pagination__btn--prev">
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-left"></use>
            </svg>
            <span>Page ${currentPage - 1}</span>
          </button>
      `;
    }

    //between first and last page
    if (currentPage < numPages) {
      return `
          <button data-goto="${
            currentPage - 1
          }" class="btn--inline pagination__btn--prev">
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-left"></use>
            </svg>
            <span>Page ${currentPage - 1}</span>
          </button>
          <button data-goto="${
            currentPage + 1
          }" class="btn--inline pagination__btn--next">
            <span>Page ${currentPage + 1}</span>
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-right"></use>
            </svg>
          </button>
      `;
    }

    //page 1, there are no other pages!
    return ``;
  }
}

export default new PaginationView();
