import React from 'react';
import {StyleSheet, View, Text, Animated, ViewStyle, TextStyle} from 'react-native';

const SHADOW_COLOR = '#add8e6';
const MAIN_COLOR = '#ff003c';
const ANIMATION_DURATION = 1500;
const GLITCH_AMPLITUDE = 5;
const REPEAT_DELAY = 2000;

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    width: '100%'
  },
  leftCorner: {
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderStyle: 'solid',
    borderRightColor: 'transparent',
    transform: [{rotate: '90deg'}],
  },
  rightSide: {
    borderRightWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    alignContent: 'stretch',
    textAlign: 'center',
    width: '100%'
  },
  rightSideCover: {
    borderTopWidth: 2,
  },
  leftSideCover: {
    borderLeftWidth: 2,
  },
  coverContainer: {
    position: 'absolute',
    overflow: 'hidden',
    height: 0,
    zIndex: 1,
  },
  labelText: {
    color: '#ffffff',
    fontWeight: 'bold',
    letterSpacing: 2,
    textAlign: 'center',
    width: '120%'
  },
  glitchText: {
    textShadowOffset: {width: 3, height: 2},
    textShadowRadius: 1,
  },
});

type CyberButtonProps = {
    label?: string;
    buttonHeight?: number
    glitchAmplitude?: number;
    glitchDuration?: number;
    repeatDelay?: number;
    shadowColor?: string;
    mainColor?: string;
    labelTextStyle?: ViewStyle | TextStyle,
    labelContainerStyle?: ViewStyle,
    disableAutoAnimation?: boolean
    style?: ViewStyle
}

const CyberButton:React.FC<CyberButtonProps> = (
  {
    label = '',
    buttonHeight = 80,
    glitchAmplitude = GLITCH_AMPLITUDE,
    glitchDuration = ANIMATION_DURATION,
    repeatDelay = REPEAT_DELAY,
    shadowColor = SHADOW_COLOR,
    mainColor = MAIN_COLOR,
    labelTextStyle,
    labelContainerStyle,
    disableAutoAnimation = false,
    style = {}
  }
) => {
  const cornerCutSize = React.useMemo(() => buttonHeight / 4, [buttonHeight]);
  const mainAnimatedValue = React.useRef(new Animated.Value(0)).current;
  const animatedX = React.useRef(new Animated.Value(0)).current;

  const runAnimation = React.useCallback(() => {
    Animated.loop(
      Animated.sequence([
        Animated.spring(animatedX, {
          toValue: -glitchAmplitude,
          useNativeDriver: false,
          speed: 1000,
          bounciness: 1000,
        }),
        Animated.spring(animatedX, {
          toValue: glitchAmplitude,
          useNativeDriver: false,
          speed: 1000,
          bounciness: 1000,
        }),
      ]),
    ).start()
  
    Animated.timing(mainAnimatedValue, {
      toValue: 100,
      duration: glitchDuration,
      useNativeDriver: false,
    }).start(() => {
      mainAnimatedValue.setValue(0);
      if (!disableAutoAnimation) {
        setTimeout(() => runAnimation(), repeatDelay);
      }
    });
  }, [glitchAmplitude, glitchDuration, repeatDelay, disableAutoAnimation]);

  React.useEffect(() => {
    if (!disableAutoAnimation) {
      runAnimation();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const height = React.useMemo(() => mainAnimatedValue.interpolate({
    inputRange: [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100],
    outputRange: [
      0.01,
      buttonHeight / 4,
      buttonHeight / 8,
      buttonHeight / 2.5,
      buttonHeight / 2.5,
      buttonHeight / 2.5,
      buttonHeight / 5.5,
      buttonHeight / 4,
      buttonHeight / 8,
      buttonHeight / 8,
      buttonHeight / 4,
    ],
  }), [buttonHeight]);

  const positionY = React.useMemo(() => mainAnimatedValue.interpolate({
    inputRange: [0, 10, 20, 30, 60, 65, 70, 80, 90, 100],
    outputRange: [
      buttonHeight / 2.5,
      buttonHeight / 2,
      buttonHeight / 4,
      buttonHeight / 1.3,
      buttonHeight / 1.3,
      buttonHeight / 4,
      buttonHeight / 16,
      0,
      0,
      buttonHeight / 4,
    ],
  }), [buttonHeight]);

  const renderButton = React.useCallback((isCover = false) => {
    return (
      <View style={[styles.row]}>
        <View>
          <View
            style={[
              {
                height: buttonHeight - cornerCutSize,
                width: cornerCutSize,
                backgroundColor: mainColor,
              },
              isCover ? styles.leftSideCover : null,
              isCover ? {borderLeftColor: shadowColor} : null,
            ]}
          />
          <View
            style={[
              styles.leftCorner,
              {
                borderRightWidth: cornerCutSize,
                borderTopWidth: cornerCutSize,
                borderTopColor: mainColor,
              },
            ]}
          />
        </View>
        <View
          style={[
            styles.rightSide,
            isCover ? styles.rightSideCover : null,
            {
              height: buttonHeight,
              paddingRight: cornerCutSize * 2,
              paddingLeft: cornerCutSize,
              borderColor: shadowColor,
              backgroundColor: mainColor,
            },
            isCover
              ? {
                  borderRightWidth: buttonHeight / 16,
                  borderBottomWidth: buttonHeight / 16,
                }
              : null,
          ]}>
          <Text
            numberOfLines={1}
            adjustsFontSizeToFit
            style={[
              styles.labelText,
              {fontSize: buttonHeight / 2.5},
              labelTextStyle,
              isCover ? styles.glitchText : null,
              isCover ? {textShadowColor: shadowColor} : null
            ]}>
            {label?.toUpperCase()}
          </Text>
        </View>
      </View>
    );
  }, [buttonHeight,cornerCutSize,mainColor,shadowColor,labelTextStyle, label]);

  return (
    <View style={[styles.row, style]}>
      {renderButton()}
      <Animated.View
        style={[
          styles.row,
          styles.coverContainer,
          {height},
          {transform: [{translateX: animatedX}, {translateY: positionY}]},
        ]}>
        <Animated.View
          style={[
            styles.row,
            {
              transform: [{translateY: Animated.multiply(positionY, -1)}],
              height: buttonHeight,
            },
          ]}>
          {renderButton(true)}
        </Animated.View>
      </Animated.View>
    </View>
  );
}

export default CyberButton;
