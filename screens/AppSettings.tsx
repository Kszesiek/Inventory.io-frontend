import {FlatList, Platform, StatusBar, StyleSheet, Switch, TouchableOpacity} from "react-native";
import {Text, View} from "../components/Themed";
import Card from "../components/Themed/Card";
import {useState} from "react";

type settingsType = {name: string, value: string | number | boolean}

const settingsRows: settingsType[] = [
  {name: 'Motyw', value: 'auto'},
  {name: 'Demo mode', value: true},
]

export default function AppSettings() {
  const [isEnabled, setIsEnabled] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState();
  const toggleSwitch = () => setIsEnabled(previousState => !previousState);


  function renderMenuItem({name, value}: settingsType) {
    if (typeof value === 'string' || typeof value === 'number') {
      return (
          <TouchableOpacity>
            <View style={[styles.cardView, styles.stringCardView]}>
              <Text style={textStyles.optionName}>{name}</Text>
              <Text style={textStyles.optionValue}>{value}</Text>
            </View>
          </TouchableOpacity>
          // {/*<Picker*/}
          // {/*  mode="dropdown"*/}
          // {/*  dropdownIconColor={textColor}*/}
          // {/*  selectedValue={selectedLanguage}*/}
          // {/*  style={styles.picker}*/}
          // {/*  itemStyle={styles.pickerItem}*/}
          // {/*  onValueChange={(itemValue, itemIndex) =>*/}
          // {/*    setSelectedLanguage(itemValue)*/}
          // {/*  }>*/}
          // {/*  <Picker.Item color={textColor} label="Java" value="java" />*/}
          // {/*  <Picker.Item  color={textColor} label="JavaScript" value="js" />*/}
          // {/*</Picker>*/}

        // <TouchableOpacity style={styles.cardView}>
        //   <Text style={textStyles.optionName}>{name}</Text>
        //   <Text style={textStyles.optionValue}>{value}</Text>
        // </TouchableOpacity>

        // style={{...styles.pickerItem, backgroundColor: bgColor}}
        // style={styles.pickerItem}
      )
    }
    else if (typeof value === 'boolean') {
      return (
        <View style={styles.cardView}>
          <Text style={textStyles.optionName}>{name}</Text>
          <Switch
            style={styles.switch}
            trackColor={{ false: "#767577", true: "#81b0ff" }}
            thumbColor={isEnabled ? "#4285F4" : "#f4f3f4"}
            ios_backgroundColor="#3e3e3e"
            onValueChange={toggleSwitch}
            value={isEnabled}
          />
        </View>
      )
    }
  }

  return (
    <View style={styles.container} lightColor="#F9FBFC" darkColor="#1E2E3D" >
      <FlatList
        data={settingsRows}
        contentContainerStyle={{...styles.flatList, paddingTop: StatusBar.currentHeight}}
        ListHeaderComponent={
        <View style={{alignItems: 'center', backgroundColor: 'transparent'}}>
          <Text style={textStyles.title}>Ustawienia</Text>
        </View>
        }
        renderItem={({item}) =>
        <Card
          style={styles.listItem}
          lightColor="white"
          darkColor="#273444"
        >
          {renderMenuItem(item)}
        </Card>
      } />
    </View>
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
  switch: {
    marginVertical: Platform.OS === 'android' ? -15 : 0,  // on jest po prostu za duuży w pionie
    // backgroundColor: 'magenta',
  },
  // picker: {
  //   borderRadius: 20,
  //   flex: 1,
  // },
  // pickerItem: {
  //   // overflow: 'hidden',
  //   // borderRadius: 10,
  //   fontSize: 20
  // },
})

const textStyles = StyleSheet.create({
  optionName: {

  },
  optionValue: {

  },
  title: {
    fontSize: 24,
    padding: 40,
  }
})