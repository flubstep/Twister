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
    let fontWeight = this.props.word[0] == '?' ? '100' : '400';
    let fontFamily = this.props.word[0] == '?' ? 'Helvetica Neue' : 'Gill Sans';
    let fontSize = this.props.fontSize;
    return (
      <Text style={[
        BaseStyles.largeText,
        {fontWeight, fontFamily, fontSize}
        ]}>{this.props.word}</Text>
    );
  }

}


class DiscoveredWordsColumn extends React.Component {

  render() {
    return (
      <View style={[BaseStyles.centerContent, styles.wordsPanel]}>
        {this.props.words.map((word, index) => {
          let key = word + index;
          return (<DiscoverWord key={key} fontSize={this.props.fontSize} word={word}/>);
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

    let columnLength = allWords.length/3;
    let columnWords1 = slice(allWords, 0, columnLength);
    let columnWords2 = slice(allWords, columnLength, columnLength*2);
    let columnWords3 = slice(allWords, columnLength*2);

    function hideIfUnrevealed(word) {
      if (contains(revealedWords, word)) {
        return word;
      } else {
        return hideWord(word);
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

let styles = StyleSheet.create({

  discoveredWordsContainer: {
    height: Dimensions.windowHeight/2,
    width: Dimensions.windowWidth,
    flexDirection: 'row',
    backgroundColor: Colors.white
  },
  wordsPanel: {
    width: Dimensions.windowWidth/3,
    height: Dimensions.windowHeight/2
  }

});

module.exports = DiscoveredWords;