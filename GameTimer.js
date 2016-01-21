/**
 * @providesModule GameTimer
 */

'use strict';

let React = require('react-native');
let {
  StyleSheet,
  Text,
  View,
  Animated
} = React;

let ReactMixin = require('react-mixin');
let TimerMixin = require('react-timer-mixin');

let {Colors, Dimensions, BaseStyles} = require('Constants');


class GameTimer extends React.Component {

  timeLeftString() {
    let timeLeftMinutes = Math.floor((this.props.timeLeft / 60)).toString();
    let timeLeftSeconds = (this.props.timeLeft % 60).toString();
    if (timeLeftSeconds.length < 2) {
      timeLeftSeconds = '0' + timeLeftSeconds;
    }
    return timeLeftMinutes + ':' + timeLeftSeconds;
  }

  render() {
    let extraStyles = (this.props.timeLeft <= 15) ? {color: Colors.red} : {};
    return (
      <View style={[BaseStyles.centerContent, styles.timerContainer]}>
        <Text style={[BaseStyles.hugeText, extraStyles]}>
          {this.timeLeftString()}
        </Text>
      </View>
    );
  }

}

let styles = StyleSheet.create({

  timerContainer: {
    height: Dimensions.windowHeight/8,
    width: Dimensions.windowWidth,
    backgroundColor: Colors.white
  }

});

module.exports = GameTimer;