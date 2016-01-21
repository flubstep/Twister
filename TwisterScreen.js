/**
 * @providesModule TwisterScreen
 */

'use strict';

let React = require('react-native');
let {
  StyleSheet,
  Text,
  View,
  Modal,
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
      timeLeft: Math.max(0, this.state.endTime - time())
    });
  }

  async fetchGame() {
    let response = await fetch(puzzleSource);
    let {word, anagrams} = await response.json();
    Actions.setLetters(word.split(''));
    Actions.setWords(anagrams);
    this.setState({
      endTime: time() + 120,
      ready: true
    });
  }

  render() {
    if (this.state.ready) {
      let boardSize = this.state.revealedWords.allWords.length;
      let fontSize = boardSizeToFontSize(boardSize);
      let revealAll = this.state.endTime <= time();
      return (
        <View>
          <GameTimer
            timeLeft={this.state.timeLeft}
          />
          <DiscoveredWords
            fontSize={fontSize}
            revealedWords={this.state.revealedWords}
            revealAll={revealAll}
            />
          <WordChooser
            wordChoice={this.state.wordChoice}
            wordChooser={this.state.wordChooser}
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