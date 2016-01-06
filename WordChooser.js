/**
 * @providesModule WordChooser
 */

'use strict';

let React = require('react-native');
let {
  StyleSheet,
  Text,
  View,
  Animated,
  Image,
  TouchableHighlight,
  TouchableWithoutFeedback
} = React;

let Actions = require('Actions');
let {Colors, Dimensions, BaseStyles} = require('Constants');


class LetterChooser extends React.Component {

  onPress() {
    if (!this.props.letterObject.used) {
      Actions.chooseLetter(this.props.letterObject);
    }
  }

  render() {
    if (this.props.letterObject.used) {
      return (
        <View
          style={[
            BaseStyles.centerContent,
            styles.letterChooser]}
          >
          <Text style={BaseStyles.largeText} />
        </View>
      );
    } else {
      return (
        <TouchableHighlight
          style={[
            BaseStyles.centerContent,
            styles.letterChooser]}
          onPressIn={() => {this.onPress()}}
          delayPressIn={0}
          >
          <Text style={BaseStyles.largeText}>
            {this.props.letterObject.letter}
          </Text>
        </TouchableHighlight>
      );
    }
  }

}

class LetterChoice extends React.Component {

  constructor(props, context) {
    super(props, context);
    this.state = {
      scale: new Animated.Value(1)
    };
  }

  componentDidMount() {
    this.state.scale.setValue(0.0);
    Animated.timing(this.state.scale, {
      toValue: 1.0,
      duration: 100
    }).start();
  }

  render() {
    return (
      <Animated.View style={[
          BaseStyles.centerContent,
          styles.letterChoice,
          {
            transform: [{'scale': this.state.scale}]
          }
        ]}
        >
        <Text style={BaseStyles.largeText}>{this.props.letter}</Text>
      </Animated.View>
    );
  }

}

class WordChoice extends React.Component {

  render() {
    return (
      <TouchableWithoutFeedback onPress={Actions.backspace}>
        <View
          style={[
            BaseStyles.centerContent,
            styles.wordChoiceContainer
            ]}
          onPress={Actions.backspace}
          >
          {this.props.letters.map((letterObject) => {
            return (
              <LetterChoice letter={letterObject.letter} />
            );
          })}
        </View>
      </TouchableWithoutFeedback>
    );
  }

}


class ActionButton extends React.Component {

  render() {
    return (
      <TouchableHighlight
        style={[BaseStyles.centerContent, styles.actionButtonContainer]}
        onPressIn={this.props.onPress}
        delayPressIn={0}
        >
        <Image source={{uri: this.props.uri}} style={styles.actionButton}/>
      </TouchableHighlight>
    );
  }

}


const SHUFFLE_IMAGE_URI = "http://flubstep.com/images/ic_autorenew_black_24dp/ios/ic_autorenew.imageset/ic_autorenew_3x.png";
const BACKSPACE_IMAGE_URI = "http://flubstep.com/images/ic_undo_black_24dp/ios/ic_undo.imageset/ic_undo_3x.png";
const SUBMIT_IMAGE_URI = "http://flubstep.com/images/ic_done_black_24dp/ios/ic_done.imageset/ic_done_3x.png";


class ActionChooser extends React.Component {

  render() {
    return (      
      <View style={[BaseStyles.centerContent, styles.actionChooser]}>
        <ActionButton
          uri={BACKSPACE_IMAGE_URI}
          onPress={Actions.backspace}
        />
        <ActionButton
          uri={SHUFFLE_IMAGE_URI}
          onPress={Actions.shuffle}
        />
        <ActionButton
          uri={SUBMIT_IMAGE_URI}
          onPress={Actions.submitWord}
        />
      </View>
    );
  }

}


class WordChooser extends React.Component {

  constructor(props, context) {
    super(props, context);
    this.state = {};
  }

  render() {
    return (

      <View style={styles.wordChooserContainer}>
        <WordChoice
          letters={this.props.wordChoice}
        />
        <View style={styles.buttonsContainer}>
          <View style={[BaseStyles.centerContent, styles.letterChooserContainer]}>
            {this.props.wordChooser.map((letter) => {
              return (
                <LetterChooser letterObject={letter}/>
              );
            })}
          </View>
          <ActionChooser />
        </View>
      </View>
    );
  }

}

let styles = StyleSheet.create({

  wordChooserContainer: {
    height: Dimensions.windowHeight/8*3,
    width: Dimensions.windowWidth,
    backgroundColor: Colors.midBackground
  },
  wordChoiceContainer: {
    height: 54,
    width: Dimensions.windowWidth,
    borderBottomWidth: 0,
    borderTopWidth: 0,
    flexDirection: 'row',
    backgroundColor: Colors.white
  },
  buttonsContainer: {
    height: (Dimensions.windowHeight/8*3) - 54,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center'
  },
  letterChoice: {
    height: 54-2,
    marginRight: 4,
    marginLeft: 4
  },
  letterChooserContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: Dimensions.windowWidth,
    marginTop: 8
  },
  letterChooser: {
    height: 54, // TODO: constants
    width: 40,
    borderWidth: 0,
    borderColor: Colors.dark,
    borderRadius: 4,
    backgroundColor: Colors.white,
    marginRight: 4,
    marginLeft: 4
  },
  actionChooser: {
    flexDirection: 'row',
    marginTop: 8
  },
  actionButtonContainer: {
    height: 54,
    width: 54,
    borderWidth: 0,
    borderColor: Colors.dark,
    borderRadius: 4,
    marginLeft: 4,
    marginRight: 4,
    backgroundColor: Colors.white
  },
  actionButton: {
    height: 36,
    width: 36
  }

});

module.exports = WordChooser;