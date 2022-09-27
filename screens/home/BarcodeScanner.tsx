import { useState, useEffect } from 'react';
import {Image, StyleSheet} from "react-native";
import {View, Text} from "../../components/Themed";
import { BarCodeScanner } from 'expo-barcode-scanner';
import {OpacityButton} from "../../components/Themed/OpacityButton";

export default function BarcodeScanner() {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [scanned, setScanned] = useState(false);

  useEffect(() => {
    const getBarCodeScannerPermissions = async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    };

    getBarCodeScannerPermissions();
  }, []);

  const handleBarCodeScanned = ({ type, data }: {type: string, data: string}) => {
    setScanned(true);
    alert(`Bar code with type ${type} and data ${data} has been scanned!`);
  };

  if (hasPermission === null) {
    return (
      <View style={styles.container}>
        <Image
          source={{uri: "https://c.tenor.com/r34MXk3BlvoAAAAi/henry-stickmin-henry.gif"}}
          style={{width: '100%', flex: 1, resizeMode: 'contain'}}
        />
      </View>
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
          onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
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