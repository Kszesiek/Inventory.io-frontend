import {StyleProp, StyleSheet, ViewStyle} from "react-native";
import {useThemeColor, Text} from "./Themed";
import {TouchableCard} from "./Themed/TouchableCard";
import {useState} from "react";
import Card from "./Themed/Card";

type dataItem = {
  label: string,
  key: string,
}

type propsType = {
  data: dataItem[]
  onPress?: ((chosenKey: string) => void)
}

export default function HighlightChooser({data, onPress}: propsType) {
  const [chosenKey, setChosenKey] = useState(data[0].key);
  const backgroundColor = useThemeColor({}, 'cardBackground');

  function onCardPressed(cardKey: string) {
    setChosenKey(cardKey);
    onPress && onPress(cardKey);
  }

  const chosenCardStyle: StyleProp<ViewStyle> = {
    backgroundColor: useThemeColor({}, "tint"),
    elevation: 10,
  }

  return <Card style={{...styles.container, backgroundColor}}>
    {data.map((item) => {
      return <TouchableCard
        style={[styles.card, item.key === chosenKey && chosenCardStyle]}
        onPress={() => onCardPressed(item.key)}
      >
        <Text style={styles.text}>{item.label}</Text>
      </TouchableCard>
    })}
  </Card>
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 100,
    flexDirection: 'row',
  },
  card: {
    flex: 1,
    alignItems: 'center',
    elevation: 0,
    padding: 8,
    borderRadius: 100,
    backgroundColor: 'transparent',
  },
  text: {
    fontSize: 18,
  },
})
