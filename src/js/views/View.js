import icons from 'url:../../img/icons.svg';

/**
 * The Parent Class to all other [...]View.js files and their Child Classes with the most important methods, that every Child Class has to inherit.
 */
export default class View {
  _data;

  /**
   * Render the received object (data) to the DOM.
   * @param {object | object[]} data The data to be rendered (e.g. recipe).
   * @param {boolean} [render=true] if false, create markup string instead of rendering to the DOM!.
   * @returns {undefined | string} A markup is returned if render=false!
   * @this {object} points to View instance.
   */
  render(data, render = true) {
    //if e.g you search for sth. that doesnt exist!
    if (!data || (Array.isArray(data) && data.length === 0))
      return this.renderErrorMessage();

    this._data = data;
    const markup = this._generateMarkup();

    if (!render) return markup;

    this._clear();
    //inserting the real data
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  /**
   *Responsible for updating the DOM. Diffrence to the 'render'-method is that we dont render a whole specfic view (e.g recipeView), but compare the current DOM to a new created DOM, which we create with the new markup and then only rerender the elements/values that actually changed (to avoid e.g img reloads). (DOM Updating Algorithm)
   * @param {object} data The data to be rendered (e.g. recipe).
   * @returns {undefined}
   * @this {object} points to View instance.
   */
  update(data) {
    this._data = data;
    const newMarkup = this._generateMarkup();

    const newDOM = document.createRange().createContextualFragment(newMarkup);
    const newElements = Array.from(newDOM.querySelectorAll('*'));
    const currentElement = Array.from(
      this._parentElement.querySelectorAll('*')
    );

    newElements.forEach((newElement, index) => {
      const curEl = currentElement[index];
      if (
        !newElement.isEqualNode(curEl) &&
        newElement.firstChild?.nodeValue.trim() !== ''
      )
        curEl.textContent = newElement.textContent;

      if (!newElement.isEqualNode(curEl))
        Array.from(newElement.attributes).forEach(attribute =>
          curEl.setAttribute(attribute.name, attribute.value)
        );
    });
  }

  /**
   * Method to easily clear a parentElements inner HTML.
   * @returns {undefined}
   */
  _clear() {
    this._parentElement.innerHTML = '';
  }

  /**
   * Responsible for rendering the spinner, which is used in various places.
   * @returns {undefined}
   * @this {object} points to View instance.
   */
  renderSpinner() {
    const markup = `
  <div class="spinner">
     <svg>
       <use href="${icons}#icon-loader"></use>
     </svg>
  </div>
  `;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  /**
   * Responsible for rendering error messages in the DOM.
   * @param {string} message the error message to get rendered.
   * @returns {undefined}
   * @this {object} points to View instance.
   */
  renderErrorMessage(message = this._errorMessage) {
    const markup = `
    <div class="error">
      <div>
        <svg>
          <use href="${icons}#icon-alert-triangle"></use>
        </svg>
      </div>
      <p>${message}</p>
    </div>
    `;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }

  /**
   * Responsible for rendering success messages in the DOM.
   * @param {string} message the success message to get rendered.
   * @returns {undefined}
   * @this {object} points to View instance.
   */
  renderSuccessMessage(message = this._successMessage) {
    const markup = `
    <div class="message">
      <div>
        <svg>
          <use href="${icons}#icon-smile"></use>
        </svg>
      </div>
      <p>${message}</p>
    </div>
    `;
    this._clear();
    this._parentElement.insertAdjacentHTML('afterbegin', markup);
  }
}
