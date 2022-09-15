import {useSelector} from "react-redux";
import {IRootState} from "../../store/store";
import {StatusBar as DefaultStatusBar} from "expo-status-bar";

export function StatusBar() {
  const theme = useSelector((state: IRootState) => state.appWide.theme)
  const statusBarTheme: typeof theme =
    theme === "light" ? "dark" :
      theme === "dark" ? "light" :
        "auto"

  return <DefaultStatusBar style={statusBarTheme} />
}