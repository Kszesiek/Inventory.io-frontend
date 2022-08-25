import {LoginStackScreenProps} from "../../types";
import {Text, View} from "../../components/Themed";
import {KeyboardAvoidingView, Platform, StyleSheet} from "react-native";
import Card from "../../components/Themed/Card";
import {useState} from "react";
import {OpacityButton} from "../../components/Themed/OpacityButton";
import {TouchableText} from "../../components/Themed/TouchableText";
import {InputCard} from "../../components/Themed/InputCard";

export default function ForgotPasswordScreen({ navigation, route }: LoginStackScreenProps<'ForgotPassword'>) {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');

  const onSignInPressed = () => {
    console.log("Sign in pressed");
    navigation.navigate("SignIn");
  };

  const onResetPasswordPressed = () => {
    console.log("Reset password pressed");
    navigation.navigate("ResetPassword");
  };

  return (
    <View style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardAvoidingView}
      >
        <View style={{flex: 2}} />
        <Text style={textStyles.title}>Resetowanie hasła</Text>
        <View style={{flex: 1}} />
        <Card style={styles.mainCard} >
          <View style={styles.formRow}>
            <Text style={textStyles.label}>Login</Text>
            <InputCard cardProps={{style: styles.inputCard}}
              textInputProps={{
                value: username,
                onChangeText: setUsername,
                placeholder: 'Wprowadź nazwę użytkownika...',
                secureTextEntry: true,
            }} />
          </View>
          <View style={styles.formRow}>
            <Text style={textStyles.label}>Adres e-mail</Text>
            <InputCard cardProps={{style: styles.inputCard}}
              textInputProps={{
                value: email,
                onChangeText: setEmail,
                placeholder: 'Wprowadź adres e-mail...',
            }} />
          </View>
          <OpacityButton
            onPress={onResetPasswordPressed}
            style={styles.resetPasswordButton}
          >
            Resetuj hasło
          </OpacityButton>
        </Card>
        <View style={styles.touchableTextContainer}>
          <Text>O, hasło ci się przypomniało?</Text>
          <TouchableText onPress={onSignInPressed}>Zaloguj się</TouchableText>
        </View>

        <View style={{flex: 2}} />
      </KeyboardAvoidingView>
    </View>
  );
};

const textStyles = StyleSheet.create({
  title: {
    fontSize: 24,
    textAlign: 'center',
    padding: 20,
  },
  label: {
    fontSize: 18,
    textAlign: 'center',
  },
  textInput: {
    flex: 1,
    textAlign: 'center',
  },
});



const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  keyboardAvoidingView: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 25,
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
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  touchableTextContainer: {
    flexDirection: 'row',
    backgroundColor: 'transparent',
    alignItems: 'center'
  },
});