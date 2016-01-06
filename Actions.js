/**
 * @providesModule Actions
 */

'use strict';

let {
  createStore,
  combineReducers
} = require('redux');
let {
  uniqueId,
  initial,
  last,
  contains,
  random
} = require('lodash');


function _shuffle(arr) {
  let shuffled = arr.slice();
  let arrMax = arr.length-1;
  for (let ii = 0; ii < arrMax; ii++) {
    let jj = random(ii+1, arrMax);
    let swap = shuffled[ii];
    shuffled[ii] = shuffled[jj];
    shuffled[jj] = swap;
  }
  return shuffled;
}


const letter = (state = {}, action) => {
  switch(action.type) {

    case 'CHOOSE_LETTER':
      if (action.letterObject.id == state.id) {
        return {
          ...state,
          used: true
        }
      } else {
        return state;
      }

    case 'SUBMIT_WORD':
      return {
        ...state,
        used: false
      }

    case 'ADD_LETTER':
      return {
        id: uniqueId(),
        letter: action.letter,
        used: false
      }

    case 'BACKSPACE':
      if (action.letterObject.id == state.id) {
        return {
          ...state,
          used: false
        }
      } else {
        return state;
      }

    default:
      return state;
  }
}


const wordChooser = (state = [], action) => {
  switch(action.type) {

    case 'CHOOSE_LETTER':
    case 'BACKSPACE':
    case 'SUBMIT_WORD':
      return state.map((l) => {
        return letter(l, action)
      });

    case 'SHUFFLE':
      return _shuffle(state);

    case 'RESET_LETTERS':
      return [];

    case 'ADD_LETTER':
      return state.concat([letter(undefined, action)]);

    default:
      return state;
  }
}


const wordChoice = (state = [], action) => {
  switch(action.type) {

    case 'CHOOSE_LETTER':
      return [
        ...state,
        action.letterObject
      ];

    case 'BACKSPACE':
      return initial(state);

    case 'SUBMIT_WORD':
      return [];

    default:
      return state;
  }
}


const revealedWords = (state = {}, action) => {
  switch(action.type) {

    case 'SUBMIT_WORD':
      if (
        contains(state.allWords, action.word) &&
        !contains(state.revealedWords, action.word)) {
        return {
          ...state,
          revealedWords: state.revealedWords.concat([action.word])
        };
      } else {
        return state;
      }

    case 'SET_WORDS':
      return {
        allWords: action.words,
        revealedWords: []
      };

    default:
      return state;
  }

}

const game = combineReducers({
  wordChooser,
  wordChoice,
  revealedWords
});
let gameStore = createStore(game);


function submitWord() {
  let state = gameStore.getState();
  let letterArray = state.wordChoice.map((l) => { return l.letter; });
  let word = letterArray.join('');
  gameStore.dispatch({
    type: 'SUBMIT_WORD',
    word: word
  });
}


function setWords(words) {
  gameStore.dispatch({
    type: 'SET_WORDS',
    words: words
  });
}


function backspace() {
  let state = gameStore.getState();
  if (state.wordChoice.length > 0) {
    let latest = last(state.wordChoice);
    gameStore.dispatch({
      type: 'BACKSPACE',
      letterObject: latest
    });
  }
}


function chooseLetter(letterObject) {
  gameStore.dispatch({
    type: 'CHOOSE_LETTER',
    letterObject: letterObject
  });
}


function setLetters(letters) {
  gameStore.dispatch({
    type: 'RESET_LETTERS'
  });
  letters.map((letter) => {
    gameStore.dispatch({
      type: 'ADD_LETTER',
      letter: letter
    });
  });
}


function shuffle() {
  gameStore.dispatch({
    type: 'SHUFFLE'
  });
}


function subscribe(callback) {
  gameStore.subscribe(() => {
    callback(gameStore.getState())
  });
}


module.exports = {
  subscribe,
  submitWord,
  setWords,
  backspace,
  chooseLetter,
  setLetters,
  shuffle
};