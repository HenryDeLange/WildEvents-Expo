import { useWindowDimensions } from 'react-native';

export function useIsMobile() {
    const { width } = useWindowDimensions();
    return width < 550;
}
