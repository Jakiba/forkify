/**
 * Child Class of the View Class. listens to submit event on search bar and eventually responsible for rendering the search bar.
 */
class SearchView {
  #parentElement = document.querySelector('.search');

  /**
   * Responsible for reading the value of the search bar and saving as well as returning it. Clears input of search bar after submit event.
   * @returns {string} submitted query by user.
   */
  //gets value of search bar!
  getQuery() {
    const query = this.#parentElement.querySelector('.search__field').value;
    this.#clearInput();
    return query;
  }

  /**
   * Method to easily clear the value of a parentElements child.
   * @returns {undefined}
   */
  #clearInput() {
    this.#parentElement.querySelector('.search__field').value = '';
  }

  /**
   *(Publisher-Subscriber-Pattern) This Publisher gets the necessary data from controller.js (Subscriber --> controlSearchResults) to pass into the event listener function. When 'submit' event is triggered, calls the handlerFunction, which then renders the search results and pagination buttons.
   * @param {function} handlerFunction controller.js function to pass in to get necessary data from model.js.
   * @returns {undefined}
   * @this {object} points to SearchView.
   */
  addHandlerSearch(handlerFunction) {
    //addEventListener to whole form so that we can listen to the 'submit'-event! (hits button or uses enter!)
    this.#parentElement.addEventListener('submit', function (e) {
      //remember when submitting a form, must use preventDefault or pages refreshes!
      e.preventDefault();
      handlerFunction();
    });
  }
}

export default new SearchView();
