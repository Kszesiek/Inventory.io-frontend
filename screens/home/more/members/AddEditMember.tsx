import {Alert, ScrollView, StyleSheet} from "react-native";
import {useThemeColor, View} from "../../../../components/Themed";
import {MembersStackScreenProps} from "../../../../types";
import {useLayoutEffect, useState} from "react";
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
    });

  useLayoutEffect(() => {
    navigation.setOptions({
      title: !!member ? "Edytuj wypożyczenie" : "Stwórz wypożyczenie"
    });
  }, [navigation, !!member])

  function cancelPressed() {
    console.log("cancel button pressed");
    navigation.goBack();
  }

  async function submitPressed() {
    const usernameIsValid: boolean = inputs.username.value.trim().length > 0 && inputs.username.value.trim().length < 100;
    const nameIsValid: boolean = inputs.name.value.trim().length > 0 && inputs.name.value.trim().length < 100;
    const surnameIsValid: boolean = inputs.surname.value.trim().length > 0 && inputs.surname.value.trim().length < 100;

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
      }
    });

    if (!usernameIsValid) {
      const wrongDataArray: string[] = []
      if (!usernameIsValid)
        wrongDataArray.push("username")
      const wrongDataString: string = writeOutArray(wrongDataArray)

      Alert.alert("Invalid values", `Some data seems incorrect. Please check ${wrongDataString} and try again.`);
      return;
    }

    const memberData: Member = {
      username: inputs.username.value,
      name: inputs.name.value,
      surname: inputs.surname.value,
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

  const buttonsComponent = <View key="buttons" style={styles.buttons}>
    <OpacityButton style={[styles.button, {backgroundColor: cancelColor}]} onPress={cancelPressed}>Anuluj</OpacityButton>
    <OpacityButton style={styles.button} onPress={submitPressed}>{!!member ? "Zatwierdź" : "Utwórz"}</OpacityButton>
  </View>

  const listElements = [
    usernameComponent,
    nameComponent,
    surnameComponent,
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