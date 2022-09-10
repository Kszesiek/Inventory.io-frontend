import {StyleProp, StyleSheet, ViewStyle} from "react-native";
import {useThemeColor, Text} from "./Themed";
import {TouchableCard} from "./Themed/TouchableCard";
import {useState} from "react";
import Card from "./Themed/Card";

type dataItem = {
  label: string,
  key: string,
}

type propsType<TDataItem, TDataKey> = {
  data: TDataItem[]
  onPress?: (chosenKey: TDataKey) => void
  style?: ViewStyle
  defaultOption?: TDataKey
}

export default function HighlightChooser<TDataItem extends dataItem, TDataKey extends TDataItem['key']>({data, onPress, style, defaultOption}: propsType<TDataItem, TDataKey>) {
  const [chosenKey, setChosenKey] = useState(defaultOption || data[0].key);
  const backgroundColor = useThemeColor({}, 'cardBackground');
  const buttonTextColor = useThemeColor({}, 'buttonText');

  function onCardPressed(cardKey: TDataKey) {
    setChosenKey(cardKey);
    onPress && onPress(cardKey);
  }

  const chosenCardStyle: StyleProp<ViewStyle> = {
    backgroundColor: useThemeColor({}, "tint"),
    elevation: 10,
  }

  return <Card style={{...styles.container, backgroundColor, ...style}}>
    {data.map((item: TDataItem) => {
      return <TouchableCard
        key={item.key}
        style={[styles.card, item.key === chosenKey && chosenCardStyle]}
        onPress={() => onCardPressed(item.key as TDataKey)}
      >
        <Text style={[styles.text, item.key === chosenKey && {color: buttonTextColor}]}>{item.label}</Text>
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
