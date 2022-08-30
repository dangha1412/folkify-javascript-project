import icons from 'url:../../img/icons.svg';
import View from './View.js';

class PaginationView extends View {
  _parentElement = document.querySelector('.pagination');

  addHandlerClick(handler) {
    this._parentElement.addEventListener('click', function (e) {
      const btn = e.target.closest('.btn--inline');
      if (!btn) return;
      const goToPage = +btn.dataset.goto;
      handler(goToPage);
    });
  }

  _generateMarkup() {
    const currentPage = this._data.page;
    const numPages = Math.ceil(
      this._data.result.length / this._data.resultPerPage
    );
    //page 1 and there are others pages
    if (currentPage === 1 && numPages > 1)
      return this._generateMarkupNextButton(currentPage, numPages);
    //last page
    if (currentPage === numPages && numPages > 1)
      return this._generateMarkupPrevButton(numPages);
    //other page
    if (currentPage < numPages)
      return (
        this._generateMarkupNextButton(currentPage, numPages) +
        this._generateMarkupPrevButton(currentPage)
      );
    //page 1 and there are NO others page
    if ((currentPage === numPages) === 1) return ``;
  }
  _generateMarkupNextButton(page, numPages) {
    return `
          <button data-goto="${
            page + 1
          }" class="btn--inline pagination__btn--next">
            <span>Page ${page + 1}/${numPages}</span>
            <svg class="search__icon">
              <use href="${icons}#icon-arrow-right"></use>
            </svg>
          </button>
      `;
  }
  _generateMarkupPrevButton(pages) {
    return `
        <button data-goto="${
          pages - 1
        }" class="btn--inline pagination__btn--prev">
          <svg class="search__icon">
              <use href="${icons}#icon-arrow-left"></use>
           </svg>
          <span>Page ${pages - 1}</span>
        </button>
      `;
  }
}

export default new PaginationView();
