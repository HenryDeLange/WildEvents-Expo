import { memo, useMemo } from 'react';
import { Control, Controller } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';
import { HelperText, SegmentedButtons, SegmentedButtonsProps, Text } from 'react-native-paper';
import { ActivityCreate } from '../../../state/redux/api/wildEventsApi';

type Props = {
    control: Control<ActivityCreate, any>;
    loading?: boolean;
    disabled: boolean;
}

function Type({ control, loading, disabled }: Readonly<Props>) {
    const { t } = useTranslation();
    const typeOptions = useMemo<SegmentedButtonsProps['buttons']>(() => [
        {
            value: 'RACE',
            label: t('activityTypeRACE'),
            disabled,
            style: {
                width: '15%'
            }
        },
        {
            value: 'HUNT',
            label: t('activityTypeHUNT'),
            disabled,
            style: {
                width: '40%',
                minWidth: 130
            }
        },
        {
            value: 'QUIZ',
            label: t('activityTypeQUIZ'),
            disabled,
            style: {
                width: '15%'
            }
        },
        {
            value: 'EXPLORE',
            label: t('activityTypeEXPLORE'),
            disabled,
            style: {
                width: '30%',
                minWidth: 120
            }
        }
    ], [disabled]);
    return (
        <Controller control={control}
            name='type'
            disabled={loading || disabled}
            rules={{
                required: t('activityCardTypeRequired')
            }}
            render={({ field: { onChange, value }, fieldState: { error } }) => (
                <View>
                    <SegmentedButtons
                        style={styles.segmentedButtons}
                        value={value}
                        onValueChange={onChange}
                        buttons={typeOptions}
                    />
                    <Text variant='bodyMedium' style={styles.text}>
                        {t(`activityType${value}Details`)}
                    </Text>
                    {!!error &&
                        <HelperText type='error'>
                            {error.message}
                        </HelperText>
                    }
                </View>
            )}
        />
    );
}

export default memo(Type);

const styles = StyleSheet.create({
    segmentedButtons: {
        flexWrap: 'wrap'
    },
    text: {
        alignSelf: 'center',
        width: '90%',
        marginTop: 8
    }
});
