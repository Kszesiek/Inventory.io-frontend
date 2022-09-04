import {LoginStackScreenProps} from "../../types";
import {View, Text, TextInput} from "../../components/Themed";
import {useState} from "react";
import {KeyboardAvoidingView, Platform, StyleSheet} from "react-native";
import Card from "../../components/Themed/Card";
import Colors from "../../constants/Colors";
import {OpacityButton} from "../../components/Themed/OpacityButton";
import {TouchableText} from "../../components/Themed/TouchableText";

export default function ResetPasswordScreen({ navigation, route }: LoginStackScreenProps<'ResetPassword'>) {
  const [newPassword, setNewPassword] = useState('');
  const [newPasswordRepeated, setNewPasswordRepeated] = useState('');

  const onSetPasswordPressed = () => {
    console.log("Set password pressed");
    navigation.navigate("SignIn");
  };

  const onSignInPressed = () => {
    console.log("Sign in pressed");
    navigation.navigate("SignIn");
  };

  return (
    <View style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardAvoidingView}
      >
        <View style={{flex: 2}} />
        <View style={styles.titleBox}>
          <Text style={textStyles.title}>Tworzenie nowego hasła</Text>
          <Text style={textStyles.subtitle}>dla użytkownika {"GenericUsername"}</Text>
        </View>
        <View style={{flex: 1}} />
        <Card style={styles.mainCard} >
          <View style={styles.formRow}>
            <Text style={textStyles.label}>Nowe hasło</Text>
            <Card
              style={styles.inputCard}
              lightColor={Colors.light.textInput}
              darkColor={Colors.dark.textInput}
            >
              <TextInput
                value={newPassword}
                onChangeText={setNewPassword}
                placeholder='Wprowadź nowe hasło...'
                style={textStyles.textInput}
              />
            </Card>
          </View>
          <View style={styles.formRow}>
            <Text style={textStyles.label}>Powtórz hasło</Text>
            <Card
              style={styles.inputCard}
              lightColor={Colors.light.textInput}
              darkColor={Colors.dark.textInput}
            >
              <TextInput
                value={newPasswordRepeated}
                onChangeText={setNewPasswordRepeated}
                placeholder='Powtórz nowe hasło...'
                style={textStyles.textInput}
                secureTextEntry={true}
              />
            </Card>
          </View>
          <OpacityButton
            onPress={onSetPasswordPressed}
          >
            Ustaw nowe hasło
          </OpacityButton>
        </Card>
        <View style={styles.touchableTextContainer}>
          <Text>Nie chcesz zmieniać hasła?</Text>
          <TouchableText onPress={onSignInPressed}>Przejdź do logowania</TouchableText>
        </View>

        <View style={{flex: 2}} />
      </KeyboardAvoidingView>
    </View>
  );
};

const textStyles = StyleSheet.create({
  title: {
    fontSize: 26,
    textAlign: 'center',
    fontFamily: 'Source Sans Bold',
  },
  subtitle: {
    fontSize: 14,
    textAlign: 'center',
    paddingTop: 5,
    fontFamily: 'Source Sans SemiBold',
  },
  label: {
    fontSize: 20,
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
  titleBox: {
    textAlign: 'center',
    padding: 20,
    backgroundColor: 'transparent',
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
    width: '85%',
  },
  touchableTextContainer: {
    flexDirection: 'row',
    backgroundColor: 'transparent',
    alignItems: 'center'
  },
});