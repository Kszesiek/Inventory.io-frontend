import {Alert, ScrollView, StyleSheet} from "react-native";
import {useThemeColor, View} from "../../../../components/Themed";
import {MembersStackScreenProps} from "../../../../types";
import {useState} from "react";
import {useDispatch} from "react-redux";
import Input from "../../../../components/Input";
import {OpacityButton} from "../../../../components/Themed/OpacityButton";
import {writeOutArray} from "../../../../utilities/enlist";
import {Member, membersActions} from "../../../../store/members";

export type ValidValuePair = {
  value: string
  isInvalid: boolean
}

type inputValuesType = {
  username: ValidValuePair,
  name: ValidValuePair,
  surname: ValidValuePair,
  email: ValidValuePair,
}

export default function AddEditMember({ navigation, route }: MembersStackScreenProps<'AddEditMember'>) {
  const dispatch = useDispatch();

  const member = route.params?.member;

  const backgroundColor = useThemeColor({}, "background");
  const cancelColor = useThemeColor({}, "delete");

  const [inputs, setInputs]: [inputValuesType, Function] = useState(
    {
      username: {
        value: !!member ? member.username : "",
        isInvalid: false,
      },
      name: {
        value: !!member ? member.name : "",
        isInvalid: false,
      },
      surname: {
        value: !!member ? member.surname : "",
        isInvalid: false,
      },
      email: {
        value: !!member ? member.email : "",
        isInvalid: false,
      },
    });

  function cancelPressed() {
    console.log("cancel button pressed");
    navigation.goBack();
  }

  async function submitPressed() {
    const emailRegex: RegExp = /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;
    const usernameIsValid: boolean = inputs.username.value.trim().length > 0 && inputs.username.value.trim().length < 100;
    const nameIsValid: boolean = inputs.name.value.trim().length > 0 && inputs.name.value.trim().length < 100;
    const surnameIsValid: boolean = inputs.surname.value.trim().length > 0 && inputs.surname.value.trim().length < 100;
    const emailIsValid: boolean = inputs.email.value.trim().length > 0 && inputs.email.value.trim().length < 100 && emailRegex.test(inputs.email.value);

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
      }
    });

    if (!usernameIsValid || !nameIsValid || !surnameIsValid || !emailIsValid) {
      const wrongDataArray: string[] = []
      if (!usernameIsValid)
        wrongDataArray.push("username")
      if (!nameIsValid)
        wrongDataArray.push("name")
      if (!surnameIsValid)
        wrongDataArray.push("surname")
      if (!emailIsValid)
        wrongDataArray.push("e-mail")
      const wrongDataString: string = writeOutArray(wrongDataArray)

      Alert.alert("Invalid values", `Some data seems incorrect. Please check ${wrongDataString} and try again.`);
      return;
    }

    const memberData: Member = {
      username: inputs.username.value,
      name: inputs.name.value,
      surname: inputs.surname.value,
      email: inputs.email.value,
      id: !!member ? member.id : Math.random().toString(),
    }

    if (!!member) {
      const response = await dispatch(membersActions.modifyMember(memberData));

      console.log("edit response:");
      console.log(response);
    } else {
      const response = await dispatch(membersActions.addMember(memberData));

      console.log("add response:");
      console.log(response);
    }
    navigation.goBack();
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

  const usernameComponent = <Input
    key="username"
    label="Nazwa użytkownika"
    isInvalid={inputs.username.isInvalid}
    textInputProps={{
      placeholder: "nazwa użytkownika",
      maxLength: 40,
      onChangeText: inputChangedHandler.bind(null, "username"),
      value: inputs.username.value,
    }}
  />

  const nameComponent = <Input
    key="name"
    label="Imię"
    isInvalid={inputs.name.isInvalid}
    textInputProps={{
      placeholder: "imię",
      maxLength: 40,
      onChangeText: inputChangedHandler.bind(null, "name"),
      value: inputs.name.value,
    }}
  />

  const surnameComponent = <Input
    key="surname"
    label="Nazwisko"
    isInvalid={inputs.surname.isInvalid}
    textInputProps={{
      placeholder: "nazwisko",
      maxLength: 40,
      onChangeText: inputChangedHandler.bind(null, "surname"),
      value: inputs.surname.value,
    }}
  />

  const emailComponent = <Input
    key="email"
    label="E-mail"
    isInvalid={inputs.email.isInvalid}
    textInputProps={{
      placeholder: "e-mail",
      maxLength: 40,
      onChangeText: inputChangedHandler.bind(null, "email"),
      value: inputs.email.value,
    }}
  />

  const buttonsComponent = <View key="buttons" style={styles.buttons}>
    <OpacityButton style={[styles.button, {backgroundColor: cancelColor}]} onPress={cancelPressed}>Anuluj</OpacityButton>
    <OpacityButton style={styles.button} onPress={submitPressed}>{!!member ? "Zatwierdź" : "Utwórz"}</OpacityButton>
  </View>

  const listElements = [
    usernameComponent,
    nameComponent,
    surnameComponent,
    emailComponent,
  ]

  return (
    <ScrollView
      style={{
        ...styles.container,
        backgroundColor: backgroundColor,
      }}
      contentContainerStyle={{ flexGrow: 1 }}
      nestedScrollEnabled={true}
    >
      {listElements}
      {buttonsComponent}
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    // flexGrow: 1,
    paddingVertical: 10,
    paddingHorizontal: 10,
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'flex-end',
    flexGrow: 1,
  },
  button: {
    margin: 15,
  },
  input: {
    flex: 1,
    backgroundColor: 'transparent',
  }
});