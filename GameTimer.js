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


function time() {
  return Math.floor((new Date()).getTime()/1000);
}


class GameTimer extends React.Component {

  constructor(props, context) {
    super(props, context)
    let timeLeft = this.props.endTime - time();
    this.state = {
      timeLeft
    };
  }

  componentDidMount() {
    this.setInterval(this.onTick, 100);
  }

  onTick() {
    let timeLeft = Math.max(0, this.props.endTime - time());
    this.setState({
      timeLeft
    });
  }

  timeLeftString() {
    let timeLeftMinutes = Math.floor((this.state.timeLeft / 60)).toString();
    let timeLeftSeconds = (this.state.timeLeft % 60).toString();
    if (timeLeftSeconds.length < 2) {
      timeLeftSeconds = '0' + timeLeftSeconds;
    }
    return timeLeftMinutes + ':' + timeLeftSeconds;
  }

  render() {
    let extraStyles = (this.state.timeLeft <= 15) ? {color: 'red'} : {};
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

module.exports = ReactMixin.decorate(TimerMixin)(GameTimer);