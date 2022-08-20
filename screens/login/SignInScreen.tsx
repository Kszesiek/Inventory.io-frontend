import {StyleSheet, TouchableOpacity, Image, Platform, KeyboardAvoidingView} from 'react-native';

import { Text, View, TextInput } from '../../components/Themed';
import {LoginStackScreenProps} from '../../types';
import Card from "../../components/Card";
import {useState} from "react";

import Logo from '../../assets/images/inventory.png';

export default function SignInScreen({ navigation, route }: LoginStackScreenProps<'SignIn'>) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const onSignInPressed = () => {
    console.log("Sign in pressed");
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
    <View style={styles.screenView} lightColor="#F9FBFC" darkColor="#1E2E3D" >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardAvoidingView}>
        <View style={styles.logoContainer}>
          <Image source={Logo} style={styles.logo} resizeMode='contain' />
        </View>

        <Card
          style={styles.mainCard}
          lightColor="white"
          darkColor="#273444"
        >
          <View style={styles.formRow}>
            <Text style={textStyles.label}>Login</Text>
            <Card
              style={styles.inputCard}
              darkColor="#1E2835"
            >
              <TextInput
                value={username}
                onChangeText={setUsername}
                placeholder='Wprowadź nazwę użytkownika...'
                style={textStyles.input}
              />
            </Card>
          </View>
          <View style={styles.formRow}>
            <Text style={textStyles.label}>Hasło</Text>
            <Card
              style={styles.inputCard}
              darkColor="#1E2835"
            >
              <TextInput
                value={password}
                onChangeText={setPassword}
                placeholder='Wprowadź hasło...'
                style={textStyles.input}
                secureTextEntry={true}
              />
            </Card>
            <View style={styles.touchableTextContainer}>
              <Text>Nie pamiętasz hasła?</Text>
              <TouchableOpacity style={{padding: 5}} onPress={onResetPasswordPressed}>
                <Text style={textStyles.touchableText}>Zresetuj hasło</Text>
              </TouchableOpacity>
            </View>
          </View>
          <TouchableOpacity style={styles.resetPasswordButton} onPress={onSignInPressed} >
            <Text style={textStyles.resetPassword}>Zaloguj</Text>
          </TouchableOpacity>
        </Card>
        <View style={styles.touchableTextContainer}>
          <Text>Nie masz konta?</Text>
          <TouchableOpacity style={{padding: 5}} onPress={onRegisterPressed}>
            <Text style={textStyles.touchableText}>Zarejestruj się</Text>
          </TouchableOpacity>
        </View>

        <View style={{flex: 1}} />
      </KeyboardAvoidingView>
    </View>
  );
}

const textStyles = StyleSheet.create({
  resetPassword: {
    color: 'white',
  },
  touchableText: {
    color: '#4285F4',
  },
  label: {
    fontSize: 22,
    textAlign: 'center',
  },
  input: {
    flex: 1,
    textAlign: 'center',
  },
})



const styles = StyleSheet.create({
  screenView: {
    flex: 1,
  },
  keyboardAvoidingView: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 25,
  },
  logoContainer: {
    flex: 3,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'transparent',
  },
  logo: {
    flex: 1,
    maxWidth: '40%',
  },
  mainCard: {
    width: '100%',
    overflow: 'hidden',
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
    // flex: 1,
    height: 40,
    paddingHorizontal: 5,
    marginTop: 10,
    width: '85%',
  },
  resetPasswordButton: {
    margin: 0,
    paddingVertical: 10,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10,
    backgroundColor: '#4285F4',
  },
  touchableTextContainer: {
    flexDirection: 'row',
    backgroundColor: 'transparent',
    alignItems: 'center',
    paddingVertical: 3,
  },
});