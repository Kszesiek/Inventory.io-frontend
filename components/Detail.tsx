import {StyleSheet} from "react-native";
import {Text, useThemeColor, View} from "./Themed";
import Card from "./Themed/Card";

type props = {
  name: string
  children: any
}

export default function Detail({name, children}: props) {
  const titleColor = useThemeColor({}, "tint");

  return (
    <View style={styles.outerContainer}>
      <Text style={[{color: titleColor}, styles.title]}>{name}</Text>
      <Card style={styles.card}>
        {children}
      </Card>
    </View>
  )
}

const styles = StyleSheet.create({
  outerContainer: {
    marginHorizontal: 20,
    marginVertical: 10,
    backgroundColor: 'transparent',
  },
  title: {
    fontSize: 18,
    fontFamily: 'Source Sans SemiBold',
    marginBottom: 5,
    marginLeft: 10,
  },
  card: {
    padding: 10,
  }
})