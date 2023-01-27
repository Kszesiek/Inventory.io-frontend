import { useState, useEffect } from 'react';
import {StyleSheet} from "react-native";
import {View, Text} from "../../components/Themed";
import { BarCodeScanner } from 'expo-barcode-scanner';
import {OpacityButton} from "../../components/Themed/OpacityButton";
import {Item} from "../../store/items";
import {getItem} from "../../endpoints/items";
import {useDispatch, useSelector} from "react-redux";
import {IRootState} from "../../store/store";
import {HomescreenStackScreenProps} from "../../types";

export default function BarcodeScanner({ navigation, route }: HomescreenStackScreenProps<'BarcodeScanner'>) {
  const dispatch = useDispatch();
  const demoMode: boolean = useSelector((state: IRootState) => state.appWide.demoMode);
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [scanned, setScanned] = useState(false);

  useEffect(() => {
    const getBarCodeScannerPermissions = async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    };

    getBarCodeScannerPermissions();
  }, []);

  const handleBarcodeScanned = async ({ type, data }: {type: string, data: string}) => {
    setScanned(true);
    console.log(data);
    const item: Item | undefined | null = await getItem(dispatch, data, demoMode);
    if (!!item) {
      navigation.goBack();
      navigation.getParent()?.navigate('InventoryNavigator', {
        screen: 'ItemDetails',
        params: {
          itemId: data,
        },
      });
    }
    // alert(`Bar code with type ${type} and data ${data} has been scanned!`);
  };

  if (hasPermission === null) {
    return (
      <View style={styles.container} />
    )}

  if (!hasPermission) {
    return (
      <View style={styles.container}>
        <Text style={{textAlign: 'center'}}>Niestety, użycie skanera kodu kreskowych wymaga udzielenia dostępu do aparatu.</Text>
        <Text style={{textAlign: 'center'}}>Aby użyć skanera, udziel aplikacji dostępu do aparatu.</Text>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <View style={styles.barcodeScannerView}>
        <BarCodeScanner
          onBarCodeScanned={scanned ? undefined : handleBarcodeScanned}
          style={styles.barcodeScanner}
        />
      </View>
      <Text style={styles.helpText}>Aby zeskanować kod kreskowy, nakieruj na niego urządzenie w taki sposób, aby kod znalazł się w okienku powyżej.</Text>

      {scanned && <OpacityButton style={styles.scanAgainButton} onPress={() => setScanned(false)}>Skanuj ponownie</OpacityButton>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  barcodeScannerView: {
    width: '100%',
    aspectRatio: 3/4,
    borderRadius: 50,
    overflow: 'hidden',
  },
  barcodeScanner: {
    flexGrow: 1,
  },
  scanAgainButton: {
    position: 'absolute',
    bottom: 30,
  },
  helpText: {
    fontStyle: 'italic',
    margin: 15,
    textAlign: 'center',
    opacity: 0.8,
  },
})