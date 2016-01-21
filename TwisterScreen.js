/**
 * @providesModule TwisterScreen
 */

'use strict';

let React = require('react-native');
let {
  Dimensions,
  StyleSheet,
  Text,
  View,
  Modal,
  TouchableWithoutFeedback,
  Animated
} = React;

let Actions = require('Actions');
let DiscoveredWords = require('DiscoveredWords');
let WordChooser = require('WordChooser');
let GameTimer = require('GameTimer');


function time() {
  return Math.floor((new Date()).getTime()/1000);
}

const puzzleSource = "http://flubstep.com/twist/random.json";

class TwisterScreen extends React.Component {

  constructor(props, context) {
    super(props, context);
    this.state = {
      ready: false,
      endTime: time() + 120
    };
  }

  componentDidMount() {
    Actions.subscribe((gameState) => {
      this.setState(gameState);
    });
    this.fetchGame();
  }

  async fetchGame() {
    let response = await fetch(puzzleSource);
    let {word, anagrams} = await response.json();
    Actions.setLetters(word.split(''));
    Actions.setWords(anagrams);
    this.setState({
      ready: true
    });
  }

  render() {
    if (this.state.ready) {
      return (
        <View>
          <GameTimer
            endTime={this.state.endTime}
          />
          <DiscoveredWords
            fontSize={24}
            revealedWords={this.state.revealedWords}
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

module.exports = TwisterScreen;