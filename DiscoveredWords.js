/**
 * @providesModule DiscoveredWords
 */

'use strict';

let React = require('react-native');
let {
  StyleSheet,
  Text,
  View,
  Animated
} = React;

let {
  slice,
  contains,
  fill
} = require('lodash');

let {Colors, Dimensions, BaseStyles} = require('Constants');


class DiscoverWord extends React.Component {

  render() {
    let fontWeight = this.props.state == 'hidden' ? '100' : '400';
    let fontFamily = this.props.state == 'hidden' ? 'Helvetica Neue' : 'Gill Sans';
    let color = this.props.state == 'revealed' ? Colors.red : Colors.dark;
    let fontSize = this.props.fontSize;
    return (
      <Text style={[
        BaseStyles.largeText,
        {fontWeight, fontFamily, fontSize, color}
        ]}>{this.props.word}</Text>
    );
  }

}


class DiscoveredWordsColumn extends React.Component {

  render() {
    return (
      <View style={[BaseStyles.centerContent, styles.wordsPanel]}>
        {this.props.words.map((wordState, index) => {
          let {word, state} = wordState;
          let key = word + index;
          return (
            <DiscoverWord
              key={key}
              fontSize={this.props.fontSize}
              state={state}
              word={word}
            />
          );
        })}
      </View>
    );
  }

}


function hideWord(word) {
  return fill(Array(word.length), '?').join('');
}


class DiscoveredWords extends React.Component {

  constructor(props, context) {
    super(props, context)
    this.state = {};
  }

  render() {
    let {
      revealedWords,
      allWords
    } = this.props.revealedWords;

    let columnLength = Math.ceil(allWords.length/3);
    let columnWords1 = slice(allWords, 0, columnLength);
    let columnWords2 = slice(allWords, columnLength, columnLength*2);
    let columnWords3 = slice(allWords, columnLength*2);
    let revealAll = this.props.revealAll;

    function hideIfUnrevealed(word) {
      if (contains(revealedWords, word)) {
        return { state: 'found', word: word }
      }
      else if (revealAll) {
        return { state: 'revealed', word: word }
      }
      else {
        return { state: 'hidden', word: hideWord(word) }
      }
    }

    return (
      <View style={styles.discoveredWordsContainer}>
        <DiscoveredWordsColumn words={columnWords1.map(hideIfUnrevealed)} fontSize={this.props.fontSize}/>
        <DiscoveredWordsColumn words={columnWords2.map(hideIfUnrevealed)} fontSize={this.props.fontSize}/>
        <DiscoveredWordsColumn words={columnWords3.map(hideIfUnrevealed)} fontSize={this.props.fontSize}/>
      </View>
    );
  }

}

DiscoveredWords.defaultProps = {
  revealAll: false
};


let styles = StyleSheet.create({

  discoveredWordsContainer: {
    height: Dimensions.wordsContainerHeight,
    width: Dimensions.windowWidth,
    flexDirection: 'row',
    backgroundColor: Colors.white
  },
  wordsPanel: {
    width: Dimensions.windowWidth/3,
    height: Dimensions.wordsContainerHeight
  }

});

module.exports = DiscoveredWords;