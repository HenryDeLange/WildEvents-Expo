import { memo, useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet } from 'react-native';
import { Button, ButtonProps } from 'react-native-paper';
import { useIsMobile } from './utils';

type Props = Omit<ButtonProps, 'children'> & {
    textKey: string;
    busy?: boolean;
}

export default memo(function (props: Props) {
    const { t } = useTranslation();
    const isMobile = useIsMobile();
    return (
        <Button
            mode='text'
            uppercase
            loading={props.busy}
            disabled={props.busy}
            {...props}
            style={[
                styles.button,
                useMemo(() => ({ minWidth: isMobile ? 30 : undefined }), [isMobile]),
                props.style
            ]}
            labelStyle={useMemo(() => ({ margin: isMobile ? 10 : undefined }), [isMobile])}
            contentStyle={useMemo(() => ({ width: isMobile ? 30 : undefined, marginHorizontal: isMobile ? 4 : undefined }), [isMobile])}
        >
            {!isMobile && t(props.textKey)}
        </Button>
    );
});

const styles = StyleSheet.create({
    button: {
        justifyContent: 'center'
    }
});
