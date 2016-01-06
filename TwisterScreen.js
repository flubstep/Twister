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


const testLetters = ['P', 'A', 'N', 'E', 'R', 'A'];
const testWords = [
  'APE',
  'ARE',
  'AREA',
  'ARENA',
  'EAR',
  'EARN',
  'EPA',
  'ERA',
  'NAP',
  'NEAR',
  'PAN',
  'PAR',
  'PEN',
  'PER',
  'RAN',
  'RAP',
  'REP',
  'RNA',
  'PANERA'
];


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
      this.setState({
        ...gameState,
        ready: true
      });
    });
    // TODO: remove mock
    Actions.setLetters(testLetters);
    Actions.setWords(testWords);
  }

  render() {
    if (this.state.ready) {
      return (
        <View>
          <GameTimer
            endTime={this.state.endTime}
          />
          <DiscoveredWords
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