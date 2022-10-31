import {LoginStackScreenProps} from "../../types";
import {useState} from "react";
import {Text, TextInput, View} from "../../components/Themed";
import {Alert, KeyboardAvoidingView, Platform, StyleSheet} from "react-native";
import Card from "../../components/Themed/Card";
import Colors from "../../constants/Colors";
import {OpacityButton} from "../../components/Themed/OpacityButton";
import {TouchableText} from "../../components/Themed/TouchableText";
import {createUser} from "../../endpoints/auth";
import {useDispatch, useSelector} from "react-redux";
import {IRootState} from "../../store/store";

export default function SignInScreen({ navigation, route }: LoginStackScreenProps<'Register'>) {
  const dispatch = useDispatch();
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [passwordRepeated, setPasswordRepeated] = useState<string>('');
  const [isAuthenticating, setIsAuthenticating] = useState<boolean>(false);
  const demoMode = useSelector((state: IRootState) => state.appWide.demoMode);

  const onSignInPressed = () => {
    console.log("Sign in pressed");
    navigation.navigate("SignIn");
  };

  async function onCreateAccountPressed() {
    console.log("Create account pressed");
    setIsAuthenticating(true);

    if (username.search('@') >= 0 && password.length >= 6 && password === passwordRepeated) {
      if (demoMode) {
        navigation.navigate("SignIn");
      } else {
        const isSuccess = await createUser(dispatch, username, password);

        if (isSuccess) {
          Alert.alert('Rejestracja zakończona powodzeniem!');
          navigation.navigate("SignIn");
        } else
          Alert.alert('Rejestracja zakończona niepowodzeniem', 'Nie można założyć konta na te dane.');
      }
    } else {
      Alert.alert('Dane zawierają błędy', 'Niektóre z wprowadzonych danych są niewłaściwe. Sprawdź wprowadzone dane i spróbuj ponownie.');
    }

    setIsAuthenticating(false);
  }

  return (
    <View style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.keyboardAvoidingView}
      >
        <View style={{flex: 2}} />
        <Text style={textStyles.title}>Tworzenie nowego konta</Text>
        <View style={{flex: 1}} />
        <Card style={styles.mainCard} >
          <View style={styles.formRow}>
            <Text style={textStyles.label}>Login</Text>
            <Card
              style={styles.inputCard}
              lightColor={Colors.light.textInput}
              darkColor={Colors.dark.textInput}
            >
              <TextInput
                value={username}
                onChangeText={setUsername}
                placeholder='Wprowadź nazwę użytkownika...'
                style={textStyles.textInput}
              />
            </Card>
          </View>
          <View style={styles.formRow}>
            <Text style={textStyles.label}>Hasło</Text>
            <Card
              style={styles.inputCard}
              lightColor={Colors.light.textInput}
              darkColor={Colors.dark.textInput}
            >
              <TextInput
                value={password}
                onChangeText={setPassword}
                placeholder='Wprowadź hasło...'
                style={textStyles.textInput}
                secureTextEntry={true}
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
                value={passwordRepeated}
                onChangeText={setPasswordRepeated}
                placeholder='Powtórz hasło...'
                style={textStyles.textInput}
                secureTextEntry={true}
              />
            </Card>
          </View>
          <OpacityButton
            style={styles.registerButton}
            onPress={onCreateAccountPressed}
          >
            Utwórz konto
          </OpacityButton>
        </Card>
        <View style={styles.touchableTextContainer}>
          <Text>Masz już konto?</Text>
          <TouchableText onPress={onSignInPressed}>Zaloguj się</TouchableText>
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
    padding: 20,
    fontFamily: 'Source Sans Bold',
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
    marginVertical: 5,
    backgroundColor: 'transparent',
  },
  inputCard: {
    flex: 1,
    paddingHorizontal: 5,
    marginVertical: 10,
    width: '85%',
  },
  registerButton: {
    marginTop: 15,
    marginBottom: 5,
  },
  touchableTextContainer: {
    flexDirection: 'row',
    backgroundColor: 'transparent',
    alignItems: 'center'
  },
});