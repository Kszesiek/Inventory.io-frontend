import {ScrollView, StyleSheet, TouchableOpacity} from "react-native";
import {Text, useThemeColor, View} from "../components/Themed";
import HighlightChooser from "../components/HighlightChooser";
import Switch from "../components/Themed/Switch";
import {appWideActions} from "../store/appWide";
import {useDispatch, useSelector} from "react-redux";
import {IRootState} from "../store/store";
import Colors, {possibleAccents, possibleThemes} from "../constants/Colors";
import {TouchableCard} from "../components/Themed/TouchableCard";

export default function AppSettings() {
  const dispatch = useDispatch();
  const backgroundColor = useThemeColor({}, 'background');

  const demoModeEnabled = useSelector((state: IRootState) => state.appWide.demoMode);
  const theme = useSelector((state: IRootState) => state.appWide.theme);
  const chosenAccent = useSelector((state: IRootState) => state.appWide.accent);

  function themeChanged(chosenKey: 'auto' | typeof possibleThemes[number]) {
    dispatch(appWideActions.setTheme(chosenKey));
  }

  function setAccent(chosenAccent: typeof possibleAccents[number]) {
    dispatch(appWideActions.setAccent(chosenAccent));
  }

  function setDemoMode(isEnabled: boolean) {
    dispatch(appWideActions.setDemoMode(isEnabled));
  }

  return (
    <ScrollView style={[styles.container, styles.flatList, {backgroundColor}]}>
      <View style={[styles.listItem, {backgroundColor: 'transparent'}]}>
        <Text style={[textStyles.optionName, styles.label]}>Motyw</Text>
        <HighlightChooser
          data={[{key: 'light', label: 'jasny'}, {key: 'dark', label: 'ciemny'}, {key: 'auto', label: 'auto'}]}
          defaultOption={theme}
          onPress={themeChanged}
          style={{flex: 1}}
        />
      </View>
      <View style={[styles.listItem, {backgroundColor: 'transparent'}]}>
        <Text style={[textStyles.optionName, styles.label]}>Kolor akcentu</Text>
        <View style={{flexWrap: 'wrap', flexDirection: 'row'}}>
          {possibleAccents.map((accent) => (
              <TouchableCard
                key={accent}
                onPress={() => setAccent(accent)}
                style={{width: accent === chosenAccent ? '31%' : '27%', height: 1, aspectRatio: 1.1, backgroundColor: Colors.accent[accent].tint, margin: accent === chosenAccent ? '1%' : '3%', justifyContent: 'center', alignItems: 'center', borderRadius: 30, padding: 10}}
              >
                <Text style={{fontSize: 20, textAlign: 'center'}}>{accent}</Text>
              </TouchableCard>
            )
          )}
        </View>
      </View>
      <TouchableOpacity>
        <View style={[styles.cardView, styles.stringCardView]}>
        </View>
      </TouchableOpacity>
      <View style={styles.cardView}>
        <Text style={textStyles.optionName}>Tryb demonstracyjny</Text>
        <Switch isEnabled={demoModeEnabled} setIsEnabled={setDemoMode} />
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  flatList: {
    padding: 10,
    flexGrow: 1,
    backgroundColor: 'transparent',
  },
  listItem: {
    marginVertical: 10,
    padding: 10,
    minHeight: 50,
  },
  cardView: {
    backgroundColor: 'transparent',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
  },
  stringCardView: {
    paddingRight: 20,
  },
  label: {
    marginBottom: 6,
  },
})

const textStyles = StyleSheet.create({
  optionName: {
    fontSize: 18,
  },
  optionValue: {
    fontSize: 18,
  },
  title: {
    fontSize: 24,
    padding: 40,
  }
})