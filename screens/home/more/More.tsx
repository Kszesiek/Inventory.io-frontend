import {Alert, Image, ScrollView, StyleSheet, TouchableWithoutFeedback} from "react-native";
import {useThemeColor, View, Text} from "../../../components/Themed";
import {TouchableCard} from "../../../components/Themed/TouchableCard";
import Logo from "../../../assets/images/inventory.png";
import {useDispatch, useSelector} from "react-redux";
import {IRootState} from "../../../store/store";
import * as React from "react";
import {FontAwesome5, Ionicons, MaterialCommunityIcons} from "@expo/vector-icons";
import {MoreStackScreenProps} from "../../../types";
import {Organization, organizationsActions} from "../../../store/organizations";

export default function More({navigation, route}: MoreStackScreenProps<'More'>) {
  const dispatch = useDispatch();

  const backgroundColor = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'text');
  const deleteColor = useThemeColor({}, 'delete');

  const currentOrganization: Organization | undefined = useSelector((state: IRootState) => state.organizations.currentOrganization);

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
      >{currentOrganization?.name || "nazwa organizacji"}</Text>
      <Text
        style={styles.subtitle}
      >{currentOrganization?.description || "opis organizacji"}</Text>

      <TouchableCard style={[styles.touchableCard, styles.listCard, styles.listCardTop]}>
        <Ionicons name='construct' size={22} style={{ color: textColor, marginRight: 10}} />
        <Text style={styles.cardText}>Ustawienia organizacji</Text>
      </TouchableCard>
      <TouchableCard style={[styles.touchableCard, styles.listCard]} onPress={() => navigation.navigate("MembersNavigator")}>
        <Ionicons name='people' size={22} style={{ color: textColor, marginRight: 10}} />
        <Text style={styles.cardText}>Cz??onkowie</Text>
      </TouchableCard>
      <TouchableCard style={[styles.touchableCard, styles.listCard]} onPress={() => navigation.navigate("CategoriesNavigator")}>
        <Ionicons name='file-tray-stacked' size={22} style={{ color: textColor, marginRight: 10}} />
        <Text style={styles.cardText}>Zarz??dzanie kategoriami</Text>
      </TouchableCard>
      <TouchableCard style={[styles.touchableCard, styles.listCard, styles.listCardBottom]} onPress={() => navigation.navigate("WarehousesNavigator")}>
        <FontAwesome5 name='warehouse' size={20} style={{ color: textColor, marginRight: 10}} />
        <Text style={styles.cardText}>Magazyny</Text>
      </TouchableCard>

      <TouchableCard
        style={[
          styles.touchableCard,
          styles.listCard,
          styles.listCardTop,
          {marginTop: 20, backgroundColor: deleteColor}
        ]}
        onPress={() => {
          Alert.alert("Czy chcesz opu??ci?? t?? organizacj???", "Czy jeste?? pewien, ??e chcesz opu??ci?? t?? organizacj??? Ta operacja jest nieodwracalna.", [
            {
              text: "Anuluj",
              style: "cancel",
            },
            {
              text: "Opu???? organizacj??",
              style: "default",
              onPress: () => {
                console.log("leave organization confirmed");
                if (!!currentOrganization)
                  dispatch(organizationsActions.removeOrganization(currentOrganization.id));
                else
                  console.log("operation did not succeed (current organization undefined)");
              }
            },
          ]);
        }}
      >
        <Ionicons name="log-out" size={30} style={{ color: textColor, marginRight: 5, marginVertical: -3}} />
        <Text style={styles.cardText}>Opu???? organizacj??</Text>
      </TouchableCard>
      <TouchableCard
        style={[styles.touchableCard, styles.listCard, styles.listCardBottom, {backgroundColor: deleteColor}]}
        onPress={() => {
          Alert.alert("Czy chcesz usun???? t?? organizacj???", "Czy jeste?? pewien, ??e chcesz usun???? t?? organizacj??? Ta operacja jest nieodwracalna.", [
            {
              text: "Anuluj",
              style: "cancel",
            },
            {
              text: "Usu?? organizacj??",
              style: "default",
              onPress: () => {
                console.log("delete organization confirmed");

              }
            },
          ]);
        }}
      >
        <MaterialCommunityIcons name="delete-forever" size={30} style={{ color: textColor, marginLeft: -2, marginRight: 8}} />
        <Text style={styles.cardText}>Usu?? organizacj??</Text>
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
    marginBottom: 10,
    marginHorizontal: 10,
    fontSize: 34,
    fontFamily: 'Source Sans',
  },
  subtitle: {
    textAlign: 'center',
    marginHorizontal: 10,
    marginBottom: 20,
    fontSize: 20,
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