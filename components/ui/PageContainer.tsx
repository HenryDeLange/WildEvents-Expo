import { ScrollView, StyleSheet, View, ViewProps } from 'react-native';
import { useTheme } from 'react-native-paper';

export default function PageContainer(props: Readonly<ViewProps>) {
    const theme = useTheme();
    return (
        <ScrollView contentContainerStyle={styles.container}>
            <View
                {...props}
                style={[
                    props.style,
                    {
                        backgroundColor: theme.colors.background
                    },
                    styles.container
                ]}
            />
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        height: '100%'
    }
});
