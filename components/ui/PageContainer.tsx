import { ScrollView, StyleSheet, View, ViewProps } from 'react-native';
import { useTheme } from 'react-native-paper';

export default function PageContainer(props: Readonly<ViewProps>) {
    const theme = useTheme();
    return (
        <ScrollView
            style={{ backgroundColor: theme.colors.background }}
            contentContainerStyle={styles.container}
        >
            <View
                {...props}
                style={[styles.content, props.style]}
            />
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flexGrow: 1
    },
    content: {
        margin: 12,
        alignItems: 'center',
        justifyContent: 'center',
        flexGrow: 1
    }
});
