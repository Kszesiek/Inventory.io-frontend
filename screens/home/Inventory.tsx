import {Image, StyleSheet} from "react-native";
import {View} from "../../components/Themed";

export default function Inventory() {
  return (
    <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <Image
        source={{uri: "https://c.tenor.com/r34MXk3BlvoAAAAi/henry-stickmin-henry.gif"}}
        style={{width: '100%', flex: 1, resizeMode: 'contain'}}
      />
    </View>
  )
}

const styles = StyleSheet.create({

})