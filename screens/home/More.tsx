import {Image, ScrollView, StyleSheet, TouchableWithoutFeedback} from "react-native";
import {useThemeColor, View, Text} from "../../components/Themed";
import {TouchableCard} from "../../components/Themed/TouchableCard";
import Logo from "../../assets/images/inventory.png";
import {useSelector} from "react-redux";
import {IRootState} from "../../store/store";
import * as React from "react";
import {FontAwesome5, Ionicons} from "@expo/vector-icons";
import {MoreStackScreenProps} from "../../types";

export default function More({navigation, route}: MoreStackScreenProps<'More'>) {
  const backgroundColor = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'text');
  const organizationName: string = useSelector((state: IRootState) => state.organizations.currentOrganization?.name) || "organization name";

  let counter = 0;
  let index = 0;

  async function handlePictureTap() {
    index += 1;
    const idx: number = index;
    console.log("Handling tap #" + index.toString());
    counter += 1;

    if (counter === 7) {
      console.log("You did it!");
      navigation.navigate("HenryStickmin");
    }

    setTimeout(function(){
      console.log('decrementing counter after tap #' + idx.toString());
      counter -= 1;
    },1500);
  }

  return (
    <ScrollView
      style={{ backgroundColor }}
      contentContainerStyle={styles.container}
    >
      <View style={styles.organizationPictureContainer}>
        <TouchableWithoutFeedback style={{backgroundColor: 'red'}} onPress={handlePictureTap}>
          <Image source={Logo} style={styles.organizationPicture} resizeMode='contain' />
        </TouchableWithoutFeedback>
      </View>
      <Text
        style={styles.title}
      >{organizationName}</Text>

      <TouchableCard style={[styles.touchableCard, styles.listCard, styles.listCardTop]}>
        <Ionicons name='construct' /* business */ size={22} style={{ color: textColor, marginRight: 10}} />
        <Text style={styles.cardText}>Ustawienia organizacji</Text>
      </TouchableCard>
      <TouchableCard style={[styles.touchableCard, styles.listCard]}>
        <Ionicons name='people' size={22} style={{ color: textColor, marginRight: 10}} />
        <Text style={styles.cardText}>Członkowie organizacji</Text>
      </TouchableCard>
      <TouchableCard style={[styles.touchableCard, styles.listCard, styles.listCardBottom]}>
        <FontAwesome5 name='warehouse' size={20} style={{ color: textColor, marginRight: 10}} />
        <Text style={styles.cardText}>Magazyny</Text>
      </TouchableCard>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: {
    paddingBottom: 20,
    paddingHorizontal: 15,
  },
  organizationPictureContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    aspectRatio: 2.5,
    backgroundColor: 'transparent',
    marginTop: 30,
    marginBottom: 10,
  },
  organizationPicture: {
    height: '100%',
    aspectRatio: 1,
    backgroundColor: 'transparent',
  },
  title: {
    textAlign: 'center',
    marginTop: 0,
    marginBottom: 20,
    marginHorizontal: 10,
    fontSize: 30,
    fontFamily: 'Source Sans Light',
  },
  touchableCard: {
    padding: 12,
    marginVertical: 10,
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  listCardTop: {
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  listCard: {
    borderRadius: 0,
    marginVertical: 0,
    marginBottom: 1,
  },
  listCardBottom: {
    borderBottomLeftRadius: 10,
    borderBottomRightRadius: 10,
    marginBottom: 0,
  },
  cardText: {
    textAlign: 'left',
    fontSize: 22,
  },
})