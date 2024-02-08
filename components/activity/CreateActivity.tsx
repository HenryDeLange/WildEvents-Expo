import { ActivityCreate, useCreateActivityMutation } from '@/state/redux/api/wildEventsApi';
import { memo, useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';
import { ActivityIndicator, Button, Card, FAB, HelperText, SegmentedButtons, TextInput } from 'react-native-paper';
import { ca, registerTranslation } from 'react-native-paper-dates';
import ResponsiveCardWrapper from '../ui/ResponsiveCardWrapper';

registerTranslation('ca', ca);

type Props = {
    eventId: string;
}

function CreateActivity({ eventId }: Props) {
    // Translation
    const { t } = useTranslation();
    // State
    const [modalVisible, setModalVisible] = useState(false);
    const [name, setName] = useState('');
    const [description, setDescription] = useState<string | undefined>('');
    const [type, setType] = useState<ActivityCreate['type']>('RACE');
    const [criteria, setCriteria] = useState<ActivityCreate['criteria']>();
    // Redux
    const [doCreate, { isLoading: isCreating, isError, isSuccess }] = useCreateActivityMutation();
    // Actions
    const hideModal = useCallback(() => {
        if (!isCreating) {
            setModalVisible(false);
            setName('');
            setDescription(undefined);
            setType('RACE');
            setCriteria(undefined);
        }
    }, [isCreating, setModalVisible, setName, setDescription, setType, setCriteria]);
    useEffect(() => {
        if (isSuccess)
            hideModal();
    }, [isSuccess, hideModal]);
    const handleFloatButton = useCallback(() => setModalVisible(true), [setModalVisible]);
    const handleCreate = useCallback(() => {
        doCreate({
            activityCreate: {
                eventId: eventId,
                name: name,
                description: description,
                type: type,
                criteria: criteria
            }
        });
    }, [doCreate, eventId, name, description, type, criteria]);

    // Validation
    const nameError = name.length === 0;

    // RENDER
    const now = new Date();
    return (
        <>
            <FAB icon={isCreating ? 'loading' : 'plus'} style={styles.floatingButton}
                disabled={isCreating}
                onPress={handleFloatButton}
            />
            <ResponsiveCardWrapper modalVisible={modalVisible} hideModal={hideModal}>
                <Card.Title title={t('activityCardCreateTitle')} titleVariant='titleLarge' />
                <Card.Content style={styles.content}>
                    <SegmentedButtons
                        value={type}
                        onValueChange={setType as any}
                        buttons={[
                            {
                                value: 'RACE',
                                label: t('activityTypeRACE')
                            },
                            {
                                value: 'HUNT',
                                label: t('activityTypeHUNT')
                            },
                            {
                                value: 'QUIZ',
                                label: t('activityTypeQUIZ')
                            },
                            {
                                value: 'EXPLORE',
                                label: t('activityTypeEXPLORE')
                            }
                        ]}
                    />
                    <TextInput
                        mode='outlined'
                        label={t('activityCardName')}
                        value={name}
                        onChangeText={setName}
                        left={<TextInput.Icon icon='tag' focusable={false} disabled />}
                        autoFocus
                    />
                    <TextInput
                        mode='outlined'
                        label={t('activityCardDescription')}
                        value={description}
                        onChangeText={setDescription}
                        left={<TextInput.Icon icon='information' focusable={false} disabled />}
                        multiline
                        numberOfLines={3}
                    />
                    <SegmentedButtons
                        value={type}
                        onValueChange={setType as any}
                        buttons={[
                            {
                                value: '1',
                                label: `${t('activityCardCriteriaStep')} 1`
                            },
                            {
                                value: '2',
                                label: `${t('activityCardCriteriaStep')} 2`
                            },
                            {
                                value: '3',
                                label: `${t('activityCardCriteriaStep')} 3`
                            },
                            {
                                value: '4',
                                label: `${t('activityCardCriteriaStep')} 4`
                            },
                            {
                                value: '5',
                                label: `${t('activityCardCriteriaStep')} 5`
                            }
                        ]}
                    />
                    <View>
                        <View style={{ flexDirection: 'row', gap: 10 }}>
                            <TextInput
                                style={{ flex: 1 }}
                                mode='outlined'
                                label={'Key'}
                                value={name}
                                onChangeText={setName}
                            />
                            <TextInput
                                style={{ flex: 2 }}
                                mode='outlined'
                                label={'Value'}
                                value={description}
                                onChangeText={setDescription}
                            />
                        </View>
                    </View>
                    <View style={styles.buttonWrapper}>
                        <Button mode='contained' style={styles.button} uppercase
                            icon={isCreating ? undefined : 'check'}
                            disabled={isCreating || nameError}
                            onPress={handleCreate}
                        >
                            {isCreating ? <ActivityIndicator animating={true} /> : t('confirm')}
                        </Button>
                        {isError &&
                            <HelperText type='error' visible={isError} >
                                {t('activityCardCreateFailed')}
                            </HelperText>
                        }
                    </View>
                </Card.Content>
            </ResponsiveCardWrapper>
        </>
    );
}

export default memo(CreateActivity);

const styles = StyleSheet.create({
    floatingButton: {
        position: 'absolute',
        margin: 16,
        right: 16,
        top: 62
    },
    content: {
        gap: 15
    },
    buttonWrapper: {
        marginTop: 10,
        alignItems: 'center'
    },
    button: {
        marginTop: 10,
        width: '80%'
    }
});
