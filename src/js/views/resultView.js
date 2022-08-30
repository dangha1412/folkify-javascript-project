import previewView from './previewView.js';
import View from './View.js';

class ResultView extends View {
  _parentElement = document.querySelector('.results');
  _errorMessage = `no recipe found for your keyword (query), please try again`;
  _message = 'i will change this later';

  _generateMarkup() {
    return this._data.map(result => previewView.render(result, false)).join('');
  }
}

export default new ResultView();
