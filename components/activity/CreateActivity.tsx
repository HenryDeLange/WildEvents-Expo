import { ActivityCreate, useCreateActivityMutation } from '@/state/redux/api/wildEventsApi';
import { memo, useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';
import { ActivityIndicator, Button, Card, HelperText, SegmentedButtons, TextInput, Text } from 'react-native-paper';
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
    const [step, setStep] = useState('1');
    const [criteria, setCriteria] = useState<ActivityCreate['criteria']>([]);
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
    // Effects
    useEffect(() => {
        setStep('1');
        switch (type) {
            case 'RACE':
                setCriteria([{
                    'taxon_id': ''
                }]);
                break;
            case 'HUNT':
                setCriteria([{
                    'taxon_id': '',
                    'lat': '',
                    'lng': '',
                    'radius': ''
                }]);
                break;
            case 'QUIZ':
                setCriteria([{
                    'taxon_id': ''
                }]);
                break;
            case 'EXPLORE':
                setCriteria([{
                    'nelat': '',
                    'nelng': '',
                    'swlat': '',
                    'swlng': ''
                }]);
                break;
        }
    }, [type, setStep]);
    // Validation
    const nameError = name.length === 0;
    // RENDER
    return (
        <>
            <Button mode='contained-tonal' style={styles.addButton} uppercase
                icon={isCreating ? 'loading' : 'plus'}
                disabled={isCreating}
                onPress={handleFloatButton}
            >
                {isCreating ? <ActivityIndicator animating={true} /> : t('activityCardCreateTitle')}
            </Button>
            <ResponsiveCardWrapper modalVisible={modalVisible} hideModal={hideModal}>
                <Card.Title title={t('activityCardCreateTitle')} titleVariant='titleLarge' />
                <Card.Content style={styles.content}>
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
                    <Text variant='bodyMedium' style={{ alignSelf: 'center' }}>
                        {type === 'RACE' && t('activityTypeRaceDetails')}
                        {type === 'HUNT' && t('activityTypeHuntDetails')}
                        {type === 'QUIZ' && t('activityTypeQuizDetails')}
                        {type === 'EXPLORE' && t('activityTypeExploreDetails')}
                    </Text>
                    <SegmentedButtons
                        value={step}
                        onValueChange={setStep as any}
                        buttons={[
                            {
                                value: '1',
                                label: `${t('activityCardCriteriaStep')} 1`,
                                disabled: false
                            },
                            {
                                value: '2',
                                label: `${t('activityCardCriteriaStep')} 2`,
                                disabled: type === 'RACE'
                            },
                            {
                                value: '3',
                                label: `${t('activityCardCriteriaStep')} 3`,
                                disabled: type === 'RACE'
                            },
                            {
                                value: '4',
                                label: `${t('activityCardCriteriaStep')} 4`,
                                disabled: type === 'RACE'
                            },
                            {
                                value: '5',
                                label: `${t('activityCardCriteriaStep')} 5`,
                                disabled: type === 'RACE'
                            }
                        ]}

                    />
                    <View>
                        {criteria && criteria.map(criterion =>
                            Object.keys(criterion).map((key, index) => (
                                <View key={`step${step}Criterion${type}Entry${index}`} style={{ flexDirection: 'row', gap: 10 }}>
                                    <TextInput
                                        key={`step${step}Criterion${type}Entry${index}Key`}
                                        style={{ flex: 1 }}
                                        mode='outlined'
                                        label={'Key'}
                                        value={key}
                                        onChangeText={text => {
                                            const newCriteria = [...criteria];
                                            newCriteria[index] = {
                                                [text]: newCriteria[index][key]
                                            }
                                            setCriteria(newCriteria);
                                        }}
                                    />
                                    <TextInput
                                        key={`step${step}Criterion${type}Entry${index}Value`}
                                        style={{ flex: 2 }}
                                        mode='outlined'
                                        label={'Value'}
                                        value={criterion[key]}
                                        onChangeText={text => {
                                            const newCriteria = [...criteria];
                                            newCriteria[index] = {
                                                [key]: text
                                            }
                                            setCriteria(newCriteria);
                                        }}
                                    />
                                </View>
                            ))
                        )}
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
    addButton: {

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
