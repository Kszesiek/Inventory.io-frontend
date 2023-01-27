import {Alert, ScrollView, StyleSheet} from "react-native";
import {Text, useThemeColor, View} from "../../../../components/Themed";
import {MembersStackScreenProps} from "../../../../types";
import {useState} from "react";
import {useSelector} from "react-redux";
import Input from "../../../../components/Input";
import {OpacityButton} from "../../../../components/Themed/OpacityButton";
import {writeOutArray} from "../../../../utilities/enlist";
import {Member} from "../../../../store/members";
import {IRootState} from "../../../../store/store";
import {addMember} from "../../../../endpoints/members";
import HighlightChooser from "../../../../components/HighlightChooser";

export type ValidValuePair = {
  value: string
  isInvalid: boolean
}

type inputValuesType = {
  userId: ValidValuePair,
}

export default function AddEditMember({ navigation, route }: MembersStackScreenProps<'AddEditMember'>) {
  const backgroundColor = useThemeColor({}, "background");
  const cancelColor = useThemeColor({}, "delete");
  const members: Member[] = useSelector((state: IRootState) => state.members.members);
  const member: Member | undefined = members.find((member) => member.id === route.params?.memberId);
  const [roleId, setRoleId] = useState<number>(3);

  const [inputs, setInputs]: [inputValuesType, Function] = useState(
    {
      userId: {
        value: "",
        isInvalid: false,
      },
      // username: {
      //   value: !!member ? member.username : "",
      //   isInvalid: false,
      // },
      // name: {
      //   value: !!member ? member.name : "",
      //   isInvalid: false,
      // },
      // surname: {
      //   value: !!member ? member.surname : "",
      //   isInvalid: false,
      // },
      // email: {
      //   value: !!member ? member.email : "",
      //   isInvalid: false,
      // },
    });

  function cancelPressed() {
    console.log("cancel button pressed");
    navigation.goBack();
  }

  async function submitPressed() {
    const userIdIsValid: boolean = inputs.userId.value.trim().length > 0 && inputs.userId.value.trim().length < 50;


    setInputs((currentInputs: inputValuesType) => {
      return {
        userId: {
          value: currentInputs.userId.value,
          isInvalid: !userIdIsValid,
        },
      }
    });

    if (!userIdIsValid) {
      const wrongDataArray: string[] = []
      if (!userIdIsValid)
        wrongDataArray.push("user ID")
      const wrongDataString: string = writeOutArray(wrongDataArray)

      Alert.alert("Invalid values", `Some data seems incorrect. Please check ${wrongDataString} and try again.`);
      return;
    }

    const response: boolean = await addMember(inputs.userId.value, roleId);

    response && navigation.goBack();
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

  const userIdComponent = <Input
    key="userId"
    label="ID użytkownika"
    isInvalid={inputs.userId.isInvalid}
    textInputProps={{
      placeholder: "ID użytkownika...",
      maxLength: 40,
      onChangeText: inputChangedHandler.bind(null, "userId"),
      value: inputs.userId.value,
      autoCapitalize: "none",
    }}
  />

  const roleIdComponent = <View style={{padding: 5,}} key="role">
    <Text style={styles.label}>Typ wartości</Text>
    <HighlightChooser
      data={[{key: 3, label: 'Użytkownik'}, {key: 2, label: 'Admin'}]}
      defaultOption={roleId}
      onPress={(option) => setRoleId(option)}
      style={{flex: 1}}
    />
  </View>

  const buttonsComponent = <View key="buttons" style={styles.buttons}>
    <OpacityButton style={[styles.button, {backgroundColor: cancelColor}]} onPress={cancelPressed}>Anuluj</OpacityButton>
    <OpacityButton style={styles.button} onPress={submitPressed}>Dodaj</OpacityButton>
  </View>

  const listElements = [
    userIdComponent,
    roleIdComponent,
  ]

  return (
    <ScrollView
      style={{
        ...styles.container,
        backgroundColor: backgroundColor,
      }}
      contentContainerStyle={{ flexGrow: 1 }}
    >
      {listElements}
      {buttonsComponent}
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
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
  },
  label: {
    fontSize: 16,
    marginBottom: 4,
  },
});