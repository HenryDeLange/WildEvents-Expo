import { Link, LinkProps } from 'expo-router';
import { memo } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet } from 'react-native';
import { Button } from 'react-native-paper';
import { IconSource } from 'react-native-paper/lib/typescript/components/Icon';
import { useIsMobile } from './utils';

// TODO: How to make LinkProps know about my routes?
type Props = LinkProps<any> & {
    icon: IconSource;
    textKey: string;
}

export default memo(function ({ href, icon, textKey }: Props) {
    const { t } = useTranslation();
    const isMobile = useIsMobile();
    return (
        <Link href={href} asChild>
            <Button icon={icon} uppercase style={styles.button}>
                {!isMobile && t(textKey)}
            </Button>
        </Link>
    );
});

const styles = StyleSheet.create({
    button: {
        justifyContent: 'center'
    }
});
