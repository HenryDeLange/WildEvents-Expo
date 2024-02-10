import FontAwesome from '@expo/vector-icons/FontAwesome';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import * as Localization from 'expo-localization';
import { SplashScreen, Stack } from 'expo-router';
import i18n from 'i18next';
import { useEffect } from 'react';
import { initReactI18next, useTranslation } from 'react-i18next';
import { useColorScheme } from 'react-native';
import { MD3LightTheme, Provider as PaperProvider } from 'react-native-paper';
import { Provider as ReduxProvider } from 'react-redux';
import en from '../i18n/en';
import { store } from '../state/redux/store';
import dark from '../theme/dark.json';
import light from '../theme/light.json';

export {
    // Catch any errors thrown by the Layout component.
    ErrorBoundary
} from 'expo-router';

export const unstable_settings = {
    initialRouteName: 'index',
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
    const [loaded, error] = useFonts({
        ...FontAwesome.font
    });
    // Expo Router uses Error Boundaries to catch errors in the navigation tree.
    useEffect(() => {
        if (error) throw error;
    }, [error]);
    useEffect(() => {
        if (loaded) {
            SplashScreen.hideAsync();
        }
    }, [loaded]);
    if (!loaded) {
        return null;
    }
    return <RootLayoutNav />;
}

// Set the supported languages
const defaultLang = 'en';
const currentLanguage = (Localization.getLocales() && Localization.getLocales().length >= 1)
    ? (Localization.getLocales()[0].languageCode ?? defaultLang)
    : defaultLang;
i18n
    .use(initReactI18next) // Passes i18n down to react-i18next
    .init({
        resources: { en },
        lng: currentLanguage,
        // lng: Localization.locale,
        fallbackLng: defaultLang,
        interpolation: {
            // React already safes from xss, see https://www.i18next.com/translation-function/interpolation#unescape
            escapeValue: false
        }
    });
// registerTranslation('enGB', enGB);

function RootLayoutNav() {
    const colorScheme = useColorScheme();
    const { t } = useTranslation();
    document.title = t('app');
    return (
        <ReduxProvider store={store}>
            <PaperProvider theme={colorScheme === 'dark' ? { ...MD3LightTheme, ...dark } : { ...MD3LightTheme, ...light }}>
                {/* React Navigation uses it's own theme, for now I just configure it manually, 
                    but there are ways to merge it with the React Native Paper theme.
                    See https://callstack.github.io/react-native-paper/docs/guides/theming-with-react-navigation */}
                <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
                    <Stack>
                        <Stack.Screen name='index' />
                        <Stack.Screen name='login' />
                        <Stack.Screen name='register' />
                        <Stack.Screen name='about' />
                        <Stack.Screen name='(auth)/events/index' />
                        <Stack.Screen name='(auth)/events/[id]' />
                    </Stack>
                </ThemeProvider>
            </PaperProvider>
        </ReduxProvider>
    );
}
