import {LoginStackScreenProps} from "../../types";
import {View, Text, TextInput} from "../../components/Themed";

export default function ResetPasswordScreen({ navigation, route }: LoginStackScreenProps<'ResetPassword'>) {
  return <View style={{alignItems: 'center', justifyContent: 'center', flex: 1}}>
    <Text>Reset password baby!</Text>
  </View>
}