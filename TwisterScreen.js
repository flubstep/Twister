/**
 * @providesModule TwisterScreen
 */

'use strict';

let React = require('react-native');
let {
  StyleSheet,
  Text,
  View,
  TouchableWithoutFeedback,
  Animated
} = React;

let ReactMixin = require('react-mixin');
let TimerMixin = require('react-timer-mixin');
let {last} = require('lodash');

let Actions = require('Actions');
let DiscoveredWords = require('DiscoveredWords');
let WordChooser = require('WordChooser');
let GameTimer = require('GameTimer');

let {Dimensions} = require('Constants');


function time() {
  return Math.floor((new Date()).getTime()/1000);
}

let fontSizes = [8, 12, 16, 20, 24, 28];

function boardSizeToFontSize(boardSize) {
  let boardHeight = Dimensions.wordsContainerHeight;
  let columnLength = Math.ceil(boardSize / 3) + 2; // HACK: add 2 as buffer for the ends
  let acceptableSizes = fontSizes.filter((fontSize) => {
    let columnHeight = fontSize * columnLength;
    return (columnHeight < boardHeight);
  });
  return last(acceptableSizes);
}


const puzzleSource = "http://flubstep.com/twist/random.json";

class TwisterScreen extends React.Component {

  constructor(props, context) {
    super(props, context);
    this.state = {
      ready: false,
      loading: false,
      restartAvailable: false,
      timeLeft: 0
    };
  }

  componentDidMount() {
    Actions.subscribe((gameState) => {
      this.setState(gameState);
    });
    this.fetchGame();
    this.setInterval(this.onTick, 100);
  }

  onTick() {
    this.setState({
      timeLeft: Math.max(0, this.state.endTime - time()),
      gameDone: this.state.endTime <= time(),
      restartAvailable: (this.state.endTime + 2) <= time()
    });
  }

  enableRestart() {
    this.setState({
      restartAvailable: true
    });
  }

  async fetchGame() {
    this.setState({
      loading: true
    });
    let response = await fetch(puzzleSource);
    let {word, anagrams} = await response.json();
    // Set game timer here so that we don't accidentally reveal
    // anything if the setWords hits before next render cycle
    this.setState({
      gameDone: false,
      endTime: time() + 120
    });
    Actions.setLetters(word.split(''));
    Actions.setWords(anagrams);
    this.setState({
      loading: false,
      ready: true
    });
  }


  render() {
    if (this.state.ready) {
      let boardSize = this.state.revealedWords.allWords.length;
      let fontSize = boardSizeToFontSize(boardSize);
      return (
        <View>
          <GameTimer
            timeLeft={this.state.timeLeft}
          />
          <DiscoveredWords
            fontSize={fontSize}
            revealedWords={this.state.revealedWords}
            revealAll={this.state.gameDone}
            />
          <WordChooser
            wordChoice={this.state.gameDone ? [] : this.state.wordChoice}
            wordChooser={this.state.wordChooser}
            gameDone={this.state.gameDone}
            restartGame={this.fetchGame.bind(this)}
            restartAvailable={this.state.restartAvailable}
            loading={this.state.loading}
          />
        </View>
      );
    } else {
      return (
        <Text>Loading...</Text>
      );
    }
  }

}

let styles = StyleSheet.create({

});

module.exports = ReactMixin.decorate(TimerMixin)(TwisterScreen);