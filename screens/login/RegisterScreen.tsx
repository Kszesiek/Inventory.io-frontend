import {LoginStackScreenProps} from "../../types";
import {useState} from "react";
import {Text, TextInput, TextInputProps, View} from "../../components/Themed";
import {Alert, ScrollView, StyleSheet} from "react-native";
import Card from "../../components/Themed/Card";
import Colors from "../../constants/Colors";
import {OpacityButton} from "../../components/Themed/OpacityButton";
import {TouchableText} from "../../components/Themed/TouchableText";
import {createUser} from "../../endpoints/auth";
import {useDispatch, useSelector} from "react-redux";
import {IRootState} from "../../store/store";
import {writeOutArray} from "../../utilities/enlist";
import {UserTemplate} from "../../store/users";

export type ValidValuePair = {
  value: string
  isInvalid: boolean
}

type inputValuesType = {
  username: ValidValuePair,
  name: ValidValuePair,
  surname: ValidValuePair,
  email: ValidValuePair,
  password: ValidValuePair,
  repeatPassword: ValidValuePair,
}

export function CustomInput({title, textInputProps}: {title: string, textInputProps?: TextInputProps}) {
  return (
    <View style={styles.formRow}>
      <Text style={textStyles.label}>{title}</Text>
      <Card
        style={styles.inputCard}
        lightColor={Colors.light.textInput}
        darkColor={Colors.dark.textInput}
      >
        <TextInput style={textStyles.textInput} {...textInputProps} />
      </Card>
    </View>
  );
}

export default function SignInScreen({ navigation, route }: LoginStackScreenProps<'Register'>) {
  const dispatch = useDispatch();
  const demoMode: boolean = useSelector((state: IRootState) => state.appWide.demoMode);
  const [isAuthenticating, setIsAuthenticating] = useState<boolean>(false);

  const [inputs, setInputs]: [inputValuesType, Function] = useState(
    {
      username: {
        value: "johndoe",
        isInvalid: false,
      },
      name: {
        value: "John",
        isInvalid: false,
      },
      surname: {
        value: "Doe",
        isInvalid: false,
      },
      email: {
        value: "johndoe@example.com",
        isInvalid: false,
      },
      password: {
        value: "secret",
        isInvalid: false,
      },
      repeatPassword: {
        value: "secret",
        isInvalid: false,
      },
    });

  const onSignInPressed = () => {
    console.log("Sign in pressed");
    navigation.navigate("SignIn");
  };

  async function onCreateAccountPressed() {
    console.log("Create account pressed");
    setIsAuthenticating(true);

    const emailRegex: RegExp = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;
    const usernameIsValid: boolean = inputs.username.value.trim().length > 0 && inputs.username.value.trim().length < 100;
    const nameIsValid: boolean = inputs.name.value.trim().length > 0 && inputs.name.value.trim().length < 100;
    const surnameIsValid: boolean = inputs.surname.value.trim().length > 0 && inputs.surname.value.trim().length < 100;
    const emailIsValid: boolean = inputs.email.value.trim().length > 0 && inputs.email.value.trim().length < 100 && emailRegex.test(inputs.email.value);
    const passwordIsValid: boolean = inputs.password.value.trim().length >= 6 && inputs.password.value.length < 100;
    const repeatPasswordIsValid: boolean = inputs.password.value === inputs.repeatPassword.value;

    setInputs((currentInputs: inputValuesType) => {
      return {
        username: {
          value: currentInputs.username.value,
          isInvalid: !usernameIsValid,
        },
        name: {
          value: currentInputs.name.value,
          isInvalid: !nameIsValid,
        },
        surname: {
          value: currentInputs.surname.value,
          isInvalid: !surnameIsValid,
        },
        email: {
          value: currentInputs.email.value,
          isInvalid: !emailIsValid,
        },
        password: {
          value: currentInputs.password.value,
          isInvalid: !passwordIsValid,
        },
      repeatPassword: {
          value: currentInputs.repeatPassword.value,
          isInvalid: !repeatPasswordIsValid,
        },
      }
    });

    if (!usernameIsValid || !nameIsValid || !surnameIsValid || !emailIsValid || !passwordIsValid || !repeatPasswordIsValid) {
      const wrongDataArray: string[] = []
      if (!usernameIsValid)
        wrongDataArray.push("username")
      if (!nameIsValid)
        wrongDataArray.push("name")
      if (!surnameIsValid)
        wrongDataArray.push("surname")
      if (!emailIsValid)
        wrongDataArray.push("e-mail")
      if (!passwordIsValid)
        wrongDataArray.push("password")
      if (!repeatPasswordIsValid)
        wrongDataArray.push("repeated password")
      const wrongDataString: string = writeOutArray(wrongDataArray)

      Alert.alert("Invalid values", `Some data seems incorrect. Please check ${wrongDataString} and try again.`);
      return;
    }

    const userTemplate: UserTemplate = {
      username: inputs.username.value,
      name: inputs.name.value,
      surname: inputs.surname.value,
      email: inputs.email.value,
      password: inputs.password.value,
    }

    const response = await createUser(dispatch, userTemplate, demoMode);

    console.log("register response:");
    console.log(response);

    setIsAuthenticating(false);

    if (response) {
      Alert.alert('Rejestracja zakończona powodzeniem!');
      navigation.navigate("SignIn");
    } else {
      Alert.alert('Rejestracja zakończona niepowodzeniem', 'Nie można założyć konta na te dane.');
    }
  }

  function inputChangedHandler<InputParam extends keyof typeof inputs>(inputIdentifier: InputParam, enteredValue: string) {
    console.log(`${inputIdentifier} value changed`);
    setInputs((currentInputValues: typeof inputs) => {
      return {
        ...currentInputValues,
        [inputIdentifier]: {value: enteredValue, isInvalid: false},
      }
    })
  }

  // ACTUAL FORM FIELDS

  const usernameComponent = <CustomInput
    key="username"
    title="Login"
    // isInvalid={inputs.username.isInvalid}
    textInputProps={{
      placeholder: "Nazwa użytkownika...",
      maxLength: 100,
      onChangeText: inputChangedHandler.bind(null, "username"),
      value: inputs.username.value,
    }}
   />

  const passwordComponent = <CustomInput
    key="password"
    title="Hasło"
    // isInvalid={inputs.email.isInvalid}
    textInputProps={{
      placeholder: "Wprowadź hasło...",
      maxLength: 100,
      onChangeText: inputChangedHandler.bind(null, "password"),
      value: inputs.password.value,
      secureTextEntry: true,
    }}
  />

  const passwordRepeatComponent = <CustomInput
    key="passwordRepeat"
    title="Powtórz hasło"
    // isInvalid={inputs.email.isInvalid}
    textInputProps={{
      placeholder: "Powtórz hasło...",
      maxLength: 100,
      onChangeText: inputChangedHandler.bind(null, "repeatPassword"),
      value: inputs.repeatPassword.value,
      secureTextEntry: true,
    }}
  />

  const nameComponent = <CustomInput
    key="name"
    title="Imię"
    // isInvalid={inputs.name.isInvalid}
    textInputProps={{
      placeholder: "Imię...",
      maxLength: 100,
      onChangeText: inputChangedHandler.bind(null, "name"),
      value: inputs.name.value,
    }}
  />

  const surnameComponent = <CustomInput
    key="surname"
    title="Nazwisko"
    // isInvalid={inputs.surname.isInvalid}
    textInputProps={{
      placeholder: "Nazwisko...",
      maxLength: 100,
      onChangeText: inputChangedHandler.bind(null, "surname"),
      value: inputs.surname.value,
    }}
  />

  const emailComponent = <CustomInput
    key="email"
    title="E-mail"
    // isInvalid={inputs.email.isInvalid}
    textInputProps={{
      placeholder: "E-mail...",
      maxLength: 100,
      onChangeText: inputChangedHandler.bind(null, "email"),
      value: inputs.email.value,
    }}
  />

  const listElements = [
    usernameComponent,
    passwordComponent,
    passwordRepeatComponent,
    nameComponent,
    surnameComponent,
    emailComponent,
  ];

  return (
      <View style={styles.container}>
      {/*//   <KeyboardAvoidingView*/}
      {/*//     behavior={Platform.OS === "ios" ? "padding" : "height"}*/}
      {/*//     style={styles.keyboardAvoidingView}*/}
      {/*//     keyboardVerticalOffset={100}*/}
      {/*//     enabled*/}
      {/*//   >*/}
         <ScrollView
           contentContainerStyle={{ flexGrow: 1, paddingVertical: 40}}
         >
          <Card style={styles.mainCard}>
            {listElements}
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
         </ScrollView>
      {/*</KeyboardAvoidingView>*/}
    </View>
  );
};

const textStyles = StyleSheet.create({
  title: {
    fontSize: 26,
    textAlign: 'center',
    padding: 20,
    fontFamily: 'Source Sans SemiBold',
  },
  label: {
    fontSize: 20,
    textAlign: 'center',
  },
  textInput: {
    textAlign: 'center',
  },
});



const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  mainCard: {
    padding: 15,
    borderRadius: 20,
    margin: 20,
    elevation: 10,
  },
  formRow: {
    marginVertical: 5,
    backgroundColor: 'transparent',
  },
  inputCard: {
    paddingHorizontal: 5,
    paddingVertical: 8,
    marginVertical: 10,
    width: '90%',
    alignSelf: 'center',
  },
  registerButton: {
    marginTop: 15,
    marginBottom: 5,
    alignSelf: 'center',
  },
  touchableTextContainer: {
    flexDirection: 'row',
    backgroundColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
  },
});