import {LoginStackScreenProps} from "../../types";
import {useState} from "react";
import {Text, TextInput, View} from "../../components/Themed";
import {KeyboardAvoidingView, Platform, StyleSheet, TouchableOpacity} from "react-native";
import Card from "../../components/Card";

export default function SignInScreen({ navigation, route }: LoginStackScreenProps<'Register'>) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const onSignInPressed = () => {
    console.log("Sign in pressed");
    navigation.navigate("SignIn");
  };

  const onCreateAccountPressed = () => {
    console.log("Create account pressed");
    navigation.navigate("SignIn");
  };

  return (
    <View style={styles.screenView} lightColor="#F9FBFC" darkColor="#1E2E3D">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardAvoidingView}
      >
        <View style={{flex: 2}} />
        <Text style={textStyles.title}>Tworzenie nowego konta</Text>
        <View style={{flex: 1}} />
        <Card
          style={styles.mainCard}
          lightColor="white"
          darkColor="#273444"
        >
          <View style={styles.formRow}>
            <Text style={textStyles.label}>Login</Text>
            <Card
              style={styles.inputCard}
              lightColor="white"
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
          </View>
          <TouchableOpacity style={styles.resetPasswordButton} onPress={onCreateAccountPressed} >
            <Text style={textStyles.resetPassword}>Utwórz konto</Text>
          </TouchableOpacity>
        </Card>
        <View style={styles.touchableTextContainer}>
          <Text>Masz już konto?</Text>
          <TouchableOpacity style={{padding: 5}} onPress={onSignInPressed}>
            <Text style={textStyles.touchableText}>Zaloguj się</Text>
          </TouchableOpacity>
        </View>

        <View style={{flex: 2}} />
      </KeyboardAvoidingView>
    </View>
  );
};

const textStyles = StyleSheet.create({
  resetPassword: {
    color: 'white',
  },
  touchableText: {
    color: '#4285F4',
  },
  title: {
    fontSize: 22,
    textAlign: 'center',
    padding: 20,
  },
  label: {
    fontSize: 18,
    textAlign: 'center',
  },
  input: {
    flex: 1,
    textAlign: 'center',
  },
});



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
    height: 90,
    width: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 10,
    backgroundColor: 'transparent',
  },
  inputCard: {
    flex: 1,
    paddingHorizontal: 5,
    marginVertical: 10,
    // marginHorizontal: 20,
    width: '85%',
  },
  resetPasswordButton: {
    margin: 0,
    // height: 40,
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
    alignItems: 'center'
  },
});