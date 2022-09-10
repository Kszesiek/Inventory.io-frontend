import {Platform, StyleSheet, Switch as DefaultSwitch} from "react-native";
import React from "react";
import {useThemeColor} from "./index";

type propsType = {
  enabled: boolean,
  setEnabled: React.Dispatch<React.SetStateAction<boolean>>
}

export default function Switch({enabled, setEnabled}: propsType) {
  const toggleSwitch = () => setEnabled(previousState => !previousState);

  const tintColor = useThemeColor({}, "tint");
  const tintSecondaryColor = useThemeColor({}, "tintLight");

  return (
    <DefaultSwitch
      style={styles.switch}
      trackColor={{ true: tintSecondaryColor, false: "#767577" }}
      thumbColor={enabled ? tintColor : "#f4f3f4"}
      ios_backgroundColor="#3e3e3e"
      onValueChange={toggleSwitch}
      value={enabled}
    />
  )
}

const styles = StyleSheet.create({
  switch: {
    marginVertical: Platform.OS === 'android' ? -15 : 0,  // on jest po prostu za duuży w pionie
  },
})