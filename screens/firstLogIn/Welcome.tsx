import {useEffect, useRef, useState} from "react";
import {Animated, Dimensions, StatusBar, StyleSheet} from "react-native";
import {Text, TouchableOpacity, useThemeColor, View} from "../../components/Themed";
import {OpacityButton} from "../../components/Themed/OpacityButton";
import {WelcomeStackScreenProps} from "../../types";
import {Ionicons} from "@expo/vector-icons";
import * as React from "react";
import {appWideActions} from "../../store/appWide";
import {useDispatch} from "react-redux";

export default function Welcome({ navigation, route }: WelcomeStackScreenProps<'Welcome'>) {
  const dispatch = useDispatch();
  const deviceWidth = Dimensions.get('window').width;
  const tintColor = useThemeColor({}, "tint");
  const textColor = useThemeColor({}, "text");

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const [welcome, setWelcome] = useState(true);
  const buttonSlideAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.sequence([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 750,
        delay: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 750,
        delay: 1500,
        useNativeDriver: true,
      }),
    ]).start(secondAnimation);
  }, [fadeAnim]);

  function secondAnimation() {
    setWelcome(false);
    Animated.sequence([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 0,
        delay: 500,
        useNativeDriver: true,
      }),
      Animated.spring(
        buttonSlideAnim,
        {
          toValue: deviceWidth,
          velocity: 3,
          tension: 2,
          friction: 8,
          useNativeDriver: true,
        }
      )
    ]).start();
  }

  function somethingPressed(callback: () => void) {
    Animated.spring(
      buttonSlideAnim,
      {
        toValue: 0,
        velocity: 10,
        tension: 2,
        friction: 6,
        useNativeDriver: true,
      }
    ).start(() => {
      Animated.spring(
        buttonSlideAnim,
        {
          toValue: deviceWidth,
          delay: 300,
          velocity: 100,
          useNativeDriver: true,
        }
      ).start();
      callback();
    });
  }

  function createOrganizationPressed() {
    console.log("Create organization pressed");
    somethingPressed(() => navigation.navigate("CreateOrganization"));
  }

  function joinOrganizationPressed() {
    console.log("Join organization pressed");
    somethingPressed(() => navigation.navigate("JoinOrganization"));
  }

  return (
    <View style={{flex: 1}}>
      <Animated.View style={[styles.container, {opacity: fadeAnim}]}>
        {welcome && <Text style={[styles.welcomeText, {color: tintColor}]}>Witaj!</Text>}
        {!welcome && <View style={styles.buttonsContainer}>
          <Animated.View
            style={{
              opacity: buttonSlideAnim.interpolate({
                inputRange: [0, deviceWidth],
                outputRange: [0, 1],
              }),
              position: 'absolute',
              top: StatusBar.currentHeight,
              left: 0,
              padding: 20,
            }}
          >
            <TouchableOpacity onPress={() => {dispatch(appWideActions.signOut())}}>
              <Ionicons name='chevron-back' size={36} style={{ color: textColor}} />
            </TouchableOpacity>
          </Animated.View>
          <Animated.View
            style={[
              styles.buttonView,
              {
                transform: [{
                  translateX: buttonSlideAnim.interpolate({
                    inputRange: [0, deviceWidth],
                    outputRange: [-deviceWidth, 0],
                  })
                }]
              }
            ]}>
              <OpacityButton
                style={styles.buttonTop}
                textStyle={styles.buttonText}
                onPress={joinOrganizationPressed}
              >
                Dołącz do organizacji
              </OpacityButton>
          </Animated.View>
          <Animated.View
            style={[
              styles.buttonView,
              {
                transform: [{
                  translateX: buttonSlideAnim.interpolate({
                    inputRange: [0, deviceWidth],
                    outputRange: [deviceWidth, 0],
                  })
                }]
              }
            ]}>
            <OpacityButton
              style={styles.buttonBottom}
              textStyle={styles.buttonText}
              onPress={createOrganizationPressed}
            >
                Załóż organizację
            </OpacityButton>
          </Animated.View>
        </View>}
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  welcomeText: {
    fontSize: 42,
    fontFamily: 'Source Sans SemiBold',
  },
  buttonsContainer: {
    flex: 1,
    backgroundColor: 'transparent',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  buttonView: {
    width: '100%',
    flexDirection: 'row',
    backgroundColor: 'transparent',
    paddingVertical: 40,
  },
  buttonTop: {
    // flex: 1,
    borderTopLeftRadius: 0,
    borderBottomLeftRadius: 0,
    paddingRight: 40,
    marginRight: 40,
    flex: 1,
    elevation: 10,

  },
  buttonBottom: {
    borderTopRightRadius: 0,
    borderBottomRightRadius: 0,
    paddingLeft: 40,
    marginLeft: 40,
    flex: 1,
    elevation: 10,
  },
  buttonText: {
    fontSize: 26,
    paddingVertical: 32,
    fontWeight: 'bold',
  },
})