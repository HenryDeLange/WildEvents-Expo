import { memo, useMemo } from "react";
import { SafeAreaView } from "react-native";
import { useTheme } from "react-native-paper";
import { SafeAreaViewProps } from "react-native-safe-area-context";

function ThemedSafeAreaView(props: Readonly<SafeAreaViewProps>) {
    const theme = useTheme();
    const themedStyle = useMemo<SafeAreaViewProps['style']>(() => ({ backgroundColor: theme.colors.background }), [theme]);
    return <SafeAreaView {...props} style={[props.style, themedStyle]} />;
}

export default memo(ThemedSafeAreaView);