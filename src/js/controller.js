import * as model from './model.js';
import recipeView from './views/recipeView.js';
import searchView from './views/searchView.js';
import resultView from './views/resultView.js';
import bookmarkView from './views/bookmarkView.js';
import paginationView from './views/paginationView.js';
import addRecipeView from './views/addRecipeView.js';
import { MODAL_CLOSE_SEC } from './config.js';
import 'core-js/stable';
import 'regenerator-runtime/runtime';
import View from './views/View.js';

// https://forkify-api.herokuapp.com/v2
if (module.hot) {
  module.hot.accept();
}
///////////////////////////////////////

const controlRecipes = async function () {
  try {
    const id = window.location.hash.slice(1);
    // console.log(id);

    if (!id) return;
    recipeView.renderSpinner();
    ////////////////0)update result view to mark selected search result
    resultView.update(model.getSearchResultPage());

    ///////////1) updating bookmark view
    bookmarkView.update(model.state.bookMarks);

    /////////////2) loading recipe///////////
    await model.loadRecipe(id);

    //////////////3) render recipe/////////////
    recipeView.render(model.state.recipe);
    console.log(model.state.recipe);
  } catch (err) {
    recipeView.renderError();
  }
};

const controlSearchResult = async function () {
  try {
    resultView.renderSpinner();
    /////0) init page
    model.state.search.page = 1;

    ///////// 1) get search keywords (query)
    const query = searchView.getQuery();
    if (!query) return;

    ////// 2) load seach results/////
    await model.loadSearchResults(query);

    ////////3) render results //////
    resultView.render(model.getSearchResultPage());
    // console.log(model.state.search.result);

    //////4) render initial pagination buttons
    paginationView.render(model.state.search);
  } catch (err) {
    console.log(err);
  }
};

const controlPagination = function (goToPage) {
  ////////3) render new results //////
  resultView.render(model.getSearchResultPage(goToPage));
  // console.log(model.state.search.result);

  //////4) render new pagination buttons
  paginationView.render(model.state.search);
};

const controlServing = function (newServings) {
  //update recipe serving in state
  model.updateServings(newServings);
  //update recipe view
  // recipeView.render(model.state.recipe);
  recipeView.update(model.state.recipe);
};

const controlAddBookMark = function () {
  //////toggle bookmark
  if (model.state.recipe.bookmarked === false) {
    model.addBookMark(model.state.recipe);
  } else {
    model.deleteBookMark(model.state.recipe.id);
  }

  ///////update recipe view
  recipeView.update(model.state.recipe);

  //////render bookmarks
  bookmarkView.render(model.state.bookMarks);
};

const controlBookmark = function () {
  bookmarkView.render(model.state.bookMarks);
};

const controlAddRecipe = async function (newRecipe) {
  try {
    ////show loading spinner
    recipeView.renderSpinner();
    /////upload New Recipe Data
    await model.uploadRecipe(newRecipe);
    console.log(model.state.recipe);

    ///////render new recipe
    recipeView.render(model.state.recipe);

    ////////render succes message
    addRecipeView.renderMessage();

    ///////render bookmark view
    bookmarkView.render(model.state.bookMarks);

    ////change ID URL
    window.history.pushState(null, '', `#${model.state.recipe.id}`);

    ///////close form window
    setTimeout(function () {
      addRecipeView.toggleWindow();
    }, MODAL_CLOSE_SEC * 1000);
  } catch (err) {
    console.error(`${err}🔴`);
    addRecipeView.renderError(err.message);
  }
};

const init = function () {
  bookmarkView.addHandlerRender(controlBookmark);
  recipeView.addHandlerRender(controlRecipes);
  searchView.addHandlerSearch(controlSearchResult);
  paginationView.addHandlerClick(controlPagination);
  recipeView.addHandlerUpdateServing(controlServing);
  recipeView.addHandlerAddBookMark(controlAddBookMark);
  addRecipeView.addHandlerUpload(controlAddRecipe);
};
init();
