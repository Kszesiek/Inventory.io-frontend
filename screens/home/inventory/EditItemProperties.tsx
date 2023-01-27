import {FlatList, StyleSheet, TouchableOpacity} from "react-native";
import {Text, useThemeColor, View} from "../../../components/Themed";
import {InventoryStackScreenProps} from "../../../types";
import {useSelector} from "react-redux";
import {useEffect, useState} from "react";
import {Item} from "../../../store/items";
import Input from "../../../components/Input";
import {IRootState} from "../../../store/store";
import * as React from "react";
import {addItemValue, deleteItemValue, updateItemValue} from "../../../endpoints/items";
import {Property} from "../../../store/properties";
import {getPropertiesForCategory} from "../../../endpoints/properties";
import Switch from "../../../components/Themed/Switch";
import Card from "../../../components/Themed/Card";
import {MaterialIcons} from "@expo/vector-icons";

export type ValidValuePair<Type> = {
  value: Type
  edited: boolean
}

export default function EditItemProperties({ navigation, route }: InventoryStackScreenProps<'EditItemProperties'>) {
  const demoMode = useSelector((state: IRootState) => state.appWide.demoMode);
  const [properties, setProperties] = useState<Property[]>([]);

  const item: Item | undefined = useSelector((state: IRootState) => state.items.items.find((item_) => item_.itemId === route.params.itemId));

  const backgroundColor = useThemeColor({}, "background");
  const errorColor = useThemeColor({}, 'delete');
  const cardColor = useThemeColor({}, 'cardBackground');

  useEffect(() => {
    async function getProperties() {
      const properties: Property[] | null = await getPropertiesForCategory(route.params.categoryId, demoMode);
      Array.isArray(properties) && setProperties(properties);
    }

    getProperties();
  }, []);

  const [propertyInputs, setPropertyInputs] = useState<{[key: number]: ValidValuePair<string | number | boolean | undefined>}>({});

  useEffect(() => {
    setPropertyInputs((prevState) => {
      let newState: typeof propertyInputs = {};

      properties.forEach((property) => {

        const itemValue = item?.values?.find((value) => value.property_id === property.id)?.value;
        newState[property.id] = {
          value: prevState[property.id]?.value ||
            property.property_type_id === 3 ? itemValue === "true" : itemValue ||
            undefined,
          edited: false,
        };
      })

      return newState;
    })
  }, [properties]);

  async function submitPressed(propertyId: number) {
    const propertyValue = propertyInputs[propertyId]?.value;
    if (propertyValue === undefined) {
      console.log(`No value for property ${propertyId.toString()}`);
      return;
    }

    let response: boolean;
    if (item?.values?.some((value) => value.property_id === propertyId))
      response = await updateItemValue(route.params.itemId, propertyId, propertyValue.toString(), demoMode);
    else
      response = await addItemValue(route.params.itemId, propertyId, propertyValue.toString(), demoMode);


    console.log("update response:");
    console.log(response);

    if (response)
      setPropertyInputs((prevState) => ({
        ...prevState,
        [propertyId]: {
          value: propertyValue,
          edited: false,
        }
      }))
  }

  async function deletePressed(propertyId: number) {
    const response: boolean = await deleteItemValue(route.params.itemId, propertyId,demoMode);

    if (response)
      setPropertyInputs((prevState) => ({
        ...prevState,
        [propertyId]: {
          value: undefined,
          edited: false,
        }
      }))
  }

  function propertyInputChangedHandler<InputParam extends keyof typeof propertyInputs>(inputIdentifier: InputParam, enteredValue: string | number | boolean) {
    console.log(`${inputIdentifier} value changed`);
    console.log(`entered value: ${enteredValue}`);
    setPropertyInputs((currentInputValues) => {
      return {
        ...currentInputValues,
        [inputIdentifier]: {value: enteredValue, edited: true},
      }
    });
    console.log(propertyInputs);
  }

  return <FlatList
      data={properties}
      keyExtractor={item => item.id.toString()}
      contentContainerStyle={{backgroundColor, ...styles.container}}
      renderItem={({item}) => {
        const property = item;
        return <View style={{flexDirection: 'row'}}>
          {(property.property_type_id === 1 || property.property_type_id === 2) && <Input
            key={property.id}
            label={property.name}
            isInvalid={false}
            style={{flex: 1}}
            textInputProps={{
              placeholder: property.name.toLowerCase() + "...",
              maxLength: 100,
              onChangeText: (text) => {
                if (property.property_type_id === 2 && isNaN(Number(text)))
                  return;
                propertyInputChangedHandler(property.id, text);
              },
              value: propertyInputs[property.id]?.value?.toString() || undefined,
              multiline: false,
              keyboardType: property.property_type_id === 2 ? "numeric" : "default",
            }}
          />}
          {property.property_type_id === 3 && <View style={{marginHorizontal: 4, marginVertical: 8, flex: 1,}} key={property.id}>
              <Text style={styles.booleanPropertyLabel}>{property.name}</Text>
              <Card style={styles.booleanPropertyCard} key={property.id}>
                <Text style={styles.booleanPropertyLabel}>{property.name}</Text>
                <Switch
                  isEnabled={propertyInputs[property.id]?.value as boolean}
                  setIsEnabled={propertyInputChangedHandler.bind(null, property.id)}
                />
              </Card>
            </View>
          }
          <View>
            <View style={{flex: 7}} />
            <View style={{flexDirection: 'row'}}>
              <TouchableOpacity
                style={[styles.rowButton, !propertyInputs[property.id]?.edited && {opacity: 0.4}]}
                onPress={() => submitPressed(property.id)}
                disabled={!propertyInputs[property.id]?.edited}
              >
                <MaterialIcons name="check" size={24} color={propertyInputs[property.id]?.edited ? 'green' : 'gray'} style={{backgroundColor: cardColor, borderRadius: 100, padding: 3, elevation: 5, marginVertical: 5, marginHorizontal: 2,}} />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.rowButton}
                onPress={() => deletePressed(property.id)}
              >
                <MaterialIcons name="delete-outline" size={24} color={errorColor} style={{backgroundColor: cardColor, borderRadius: 100, padding: 3, elevation: 5, marginVertical: 5, marginHorizontal: 2,}} />
              </TouchableOpacity>
            </View>
            <View style={{flex: 2}} />
          </View>
        </View>
      }}
    />
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    margin: 15,
  },
  input: {
    flex: 1,
  },
  modalStyle: {
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    marginTop: 25,
    flex: 1,
  },
  bottomDrawerConfirmButton: {
    margin: 15,
    paddingHorizontal: 40,
    paddingVertical: 8,
    alignSelf: 'center',
  },
  propertyLabel: {
    fontSize: 16,
    marginBottom: 4,
  },
  card: {
    alignItems: 'flex-start',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 15,
    fontSize: 18,
  },
  warehouseDrawerTitle: {
    fontSize: 22,
    marginVertical: 5,
    marginHorizontal: 20,
    textAlign: 'center',
  },
  warehouseDrawerButton: {
    margin: 15,
    paddingVertical: 8,
  },
  booleanPropertyCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    marginTop: 4,
    borderRadius: 10,
  },
  booleanPropertyLabel: {
    fontSize: 16,
  },
  propertyContainer: {
    marginHorizontal: 4,
    marginVertical: 8,
  },
  rowButton: {
    marginLeft: 5,
  },
});