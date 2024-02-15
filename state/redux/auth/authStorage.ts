import AsyncStorage from "@react-native-async-storage/async-storage";

export const REFRESH_TOKEN = 'auth-refresh-token';

// Also use the useAsyncStorage hook

export async function saveData(key: string, value: string) {
    try {
        await AsyncStorage.setItem(key, value);
    }
    catch (e) {
        console.error(e);
    }
};

export async function loadData(key: string) {
    try {
        const value = await AsyncStorage.getItem(key);
        return value;
    }
    catch (e) {
        console.error(e);
    }
};
