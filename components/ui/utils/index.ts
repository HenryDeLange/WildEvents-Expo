import { ReactNode, memo } from 'react';
import { ImageSourcePropType, useWindowDimensions } from 'react-native';
import { Icon } from 'react-native-paper';
import { IconSource } from 'react-native-paper/lib/typescript/components/Icon';

export function useIsMobile() {
    const { width } = useWindowDimensions();
    return width < 700;
}
