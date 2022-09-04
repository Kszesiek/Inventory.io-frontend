import {StyleSheet, Image, Platform, KeyboardAvoidingView} from 'react-native';

import {Text, View} from '../../components/Themed';
import {LoginStackScreenProps} from '../../types';
import Card from "../../components/Themed/Card";
import {useState} from "react";

import Logo from '../../assets/images/inventory.png';
import {OpacityButton} from "../../components/Themed/OpacityButton";
import {TouchableText} from "../../components/Themed/TouchableText";
import {InputCard} from "../../components/Themed/InputCard";

export default function SignInScreen({ navigation, route }: LoginStackScreenProps<'SignIn'>) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const onSignInPressed = () => {
    console.log("Sign in pressed");
    navigation.getParent()!.navigate("Home");
  }

  const onRegisterPressed = () => {
    console.log("Register pressed");
    navigation.navigate("Register");
  }

  const onResetPasswordPressed = () => {
    console.log("Forgot password pressed");
    navigation.navigate("ForgotPassword");
  }

  return (
    <View style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardAvoidingView}
      >
        <View style={styles.logoContainer}>
          <Image source={Logo} style={styles.logo} resizeMode='contain' />
        </View>

        <Card style={styles.mainCard} >
          <View style={styles.formRow}>
            <Text style={textStyles.label}>Login</Text>
            <InputCard cardProps={{style: styles.inputCard}}
              textInputProps={{
                value: username,
                onChangeText: setUsername,
                placeholder: 'Wprowadź nazwę użytkownika...',
                style: {
                  fontFamily: 'Source Sans',
                },
            }} />
          </View>
          <View style={styles.formRow}>
            <Text style={textStyles.label}>Hasło</Text>
            <InputCard cardProps={{style: styles.inputCard}}
                textInputProps={{
                value: password,
                onChangeText: setPassword,
                placeholder: 'Wprowadź hasło...',
                secureTextEntry: true,
            }} />
            <View style={styles.touchableTextContainer}>
              <Text style={textStyles.resetPassword}>Nie pamiętasz hasła?</Text>
              <TouchableText
                onPress={onResetPasswordPressed}
                props={{ style: {padding: 4} }}
                textProps={{ style: textStyles.resetPassword }}
              >
                Zresetuj hasło
              </TouchableText>
            </View>
          </View>
          <OpacityButton
            onPress={onSignInPressed}
          >
            Zaloguj
          </OpacityButton>
        </Card>
        <View style={styles.touchableTextContainer}>
          <Text>Nie masz konta?</Text>
          <TouchableText onPress={onRegisterPressed}>Zarejestruj się</TouchableText>
        </View>

        <View style={{flex: 1}} />
      </KeyboardAvoidingView>
    </View>
  );
}

const textStyles = StyleSheet.create({
  label: {
    fontSize: 22,
    textAlign: 'center',
    fontFamily: 'Source Sans SemiBold',
  },
  textInput: {
    flex: 1,
    textAlign: 'center',
  },
  resetPassword: {
    fontSize: 13,
  }
})



const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardAvoidingView: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 25,
    backgroundColor: 'transparent',
  },
  logoContainer: {
    flex: 3,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  logo: {
    flex: 1,
    maxWidth: '33%',
  },
  mainCard: {
    width: '100%',
    padding: 15,
    alignItems: 'center',
    borderRadius: 20,
    marginVertical: 20,
    elevation: 10,
  },
  formRow: {
    minHeight: 90,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10,
    backgroundColor: 'transparent',
  },
  inputCard: {
    height: 40,
    paddingHorizontal: 5,
    marginTop: 10,
    width: '85%',
  },
  touchableTextContainer: {
    flexDirection: 'row',
    backgroundColor: 'transparent',
    alignItems: 'center',
    paddingVertical: 3,
  },
});