import { ActivityCreate, ActivityStep, useCreateActivityMutation } from '@/state/redux/api/wildEventsApi';
import * as Crypto from 'expo-crypto';
import { memo, useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';
import { ActivityIndicator, Button, Card, HelperText, IconButton, SegmentedButtons, SegmentedButtonsProps, Text, TextInput, Tooltip } from 'react-native-paper';
import ResponsiveCardWrapper from '../ui/ResponsiveCardWrapper';

const MAX_STEPS = 5;
const ADD_STEP = 'addStep';

type Props = {
    eventId: string;
}

function ModifyActivity({ eventId }: Props) {
    // Translation
    const { t } = useTranslation();
    // State
    const [modalVisible, setModalVisible] = useState(false);
    const [name, setName] = useState('');
    const [description, setDescription] = useState<string | undefined>('');
    const [type, setType] = useState<ActivityCreate['type']>('RACE');
    const [step, setStep] = useState('1');
    const [steps, setSteps] = useState<ActivityCreate['steps']>([{
        id: '',
        description: '',
        criteria: { 'taxon_id': '' }
    }]);
    const [addedSteps, setAddedSteps] = useState(1);
    // Redux
    const [doCreate, { isLoading: isCreating, isError, isSuccess }] = useCreateActivityMutation();
    // Actions
    const hideModal = useCallback(() => {
        if (!isCreating) {
            setModalVisible(false);
            setName('');
            setDescription(undefined);
            setType('RACE');
            setSteps(undefined);
        }
    }, [isCreating, setModalVisible, setName, setDescription, setType, setSteps]);
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
                steps: steps
            }
        });
    }, [doCreate, eventId, name, description, type, steps]);
    const handleStepDescription = useCallback((text: string) => {
        if (steps && step) {
            const stepIndex = Number(step) - 1;
            const newSteps: ActivityStep[] = [
                ...steps.slice(0, stepIndex),
                {
                    ...steps[stepIndex],
                    description: text
                },
                ...steps.slice(stepIndex + 1)
            ];
            setSteps(newSteps);
        }
    }, [steps, step]);
    const handleStepCriteriaValue = useCallback((key: string) => (text: string) => {
        if (steps && step) {
            const stepIndex = Number(step) - 1;
            const newSteps: ActivityStep[] = [
                ...steps.slice(0, stepIndex),
                {
                    ...steps[stepIndex],
                    description: steps[stepIndex].description,
                    criteria: {
                        ...steps[stepIndex].criteria,
                        [key]: text
                    }
                },
                ...steps.slice(stepIndex + 1)
            ];
            setSteps(newSteps);
        }
    }, [steps, step]);
    const handleStepRemove = useCallback(() => {
        if (steps && step) {
            const stepIndex = Number(step) - 1;
            const newSteps: ActivityStep[] = [
                ...steps.slice(0, stepIndex),
                ...steps.slice(stepIndex + 1)
            ];
            setSteps(newSteps);
            setAddedSteps(addedSteps - 1);
            setStep(String(Math.max(1, Number(step) - 1)));
        }
    }, [steps, step]);
    // Effects
    useEffect(() => { // Reset when the type changes
        setStep('1');
        setAddedSteps(1);
        switch (type) {
            case 'RACE':
                setSteps([{
                    id: Crypto.randomUUID(),
                    description: '',
                    criteria: { 'taxon_id': '' }
                }]);
                break;
            case 'HUNT':
                setSteps([{
                    id: Crypto.randomUUID(),
                    description: '',
                    criteria: { 'taxon_id': '', 'lat': '', 'lng': '', 'radius': '' }
                }]);
                break;
            case 'QUIZ':
                setSteps([{
                    id: Crypto.randomUUID(),
                    description: '',
                    criteria: { 'taxon_id': '' }
                }]);
                break;
            case 'EXPLORE':
                setSteps([{
                    id: Crypto.randomUUID(),
                    description: '',
                    criteria: { 'nelat': '', 'nelng': '', 'swlat': '', 'swlng': '' }
                }]);
                break;
        }
    }, [type]);
    useEffect(() => { // Add a new step
        if (step === ADD_STEP) {
            setAddedSteps(addedSteps + 1);
            setStep(String(addedSteps + 1));
            switch (type) {
                case 'RACE':
                    setSteps([...steps!, {
                        id: Crypto.randomUUID(),
                        description: '',
                        criteria: { 'taxon_id': '' }
                    }]);
                    break;
                case 'HUNT':
                    setSteps([...steps!, {
                        id: Crypto.randomUUID(),
                        description: '',
                        criteria: { 'taxon_id': '', 'lat': '', 'lng': '', 'radius': '' }
                    }]);
                    break;
                case 'QUIZ':
                    setSteps([...steps!, {
                        id: Crypto.randomUUID(),
                        description: '',
                        criteria: { 'taxon_id': '' }
                    }]);
                    break;
                case 'EXPLORE':
                    setSteps([...steps!, {
                        id: Crypto.randomUUID(),
                        description: '',
                        criteria: { 'nelat': '', 'nelng': '', 'swlat': '', 'swlng': '' }
                    }]);
                    break;
            }
        }
    }, [type, step, steps, addedSteps]);
    // Memo
    const typeOptions = useMemo(() => [
        { value: 'RACE', label: t('activityTypeRACE') },
        { value: 'HUNT', label: t('activityTypeHUNT') },
        { value: 'QUIZ', label: t('activityTypeQUIZ') },
        { value: 'EXPLORE', label: t('activityTypeEXPLORE') }
    ], []);
    const stepOptions = useMemo(() => {
        const stepButtons: SegmentedButtonsProps['buttons'] = [{ value: '1', label: t('activityCardStepCount', { step: 1 }) }];
        if (type !== 'RACE') {
            for (let i = 2; i <= addedSteps; i++) {
                stepButtons.push({ value: String(i), label: t('activityCardStepCount', { step: i }) });
            }
        }
        if (stepButtons.length < MAX_STEPS) {
            stepButtons.push({
                value: ADD_STEP,
                label: type === 'RACE' ? 'N/A' : t('activityCardStepAdd'),
                disabled: type === 'RACE',
                icon: type === 'RACE' ? undefined : 'plus'
            });
        }
        return stepButtons;
    }, [type, addedSteps]);
    // Validation
    const nameError = name.length === 0;
    let stepError = false;
    for (let tempStep of (steps ?? [])) {
        if (!tempStep.description || tempStep.description.trim().length <= 0) {
            stepError = true;
            break;
        }
        const tempCriteria = tempStep.criteria;
        if (tempCriteria) {
            for (let key of Object.keys(tempCriteria)) {
                if (!tempCriteria[key] || tempCriteria[key].trim().length <= 0) {
                    stepError = true;
                    break;
                }
            }
        }
    }
    // RENDER
    const activeStep = steps ? steps[Number(step) - 1] : null;
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
                        buttons={typeOptions}
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
                        buttons={stepOptions}
                        density='medium'
                    />
                    <View>
                        {activeStep &&
                            <View style={{ flexDirection: 'row' }}>
                                <View style={{ flex: 1, gap: 10 }}>
                                    <TextInput
                                        mode='outlined'
                                        label={t('activityCardStepDescription')}
                                        value={activeStep.description}
                                        onChangeText={handleStepDescription}
                                        left={<TextInput.Icon icon='information' focusable={false} disabled />}
                                        multiline
                                        numberOfLines={3}
                                        style={{ display: 'flex', flex: 1 }}
                                    />
                                    {Object.keys(activeStep.criteria ?? {}).map((key, index) => (
                                        <View key={`step${step}Criterion${type}Entry${index}`} style={{ flexDirection: 'row', gap: 10 }}>
                                            <Tooltip title={t(`activityCriteria_${key}`, { defaultValue: t('activityCriteria_custom') })}>
                                                <TextInput
                                                    key={`step${step}Criterion${type}Entry${index}Key`}
                                                    style={{ flex: 1 }}
                                                    mode='outlined'
                                                    label={t('activityCriteriaKey')}
                                                    value={key}
                                                    readOnly
                                                />
                                            </Tooltip>
                                            <TextInput
                                                key={`step${step}Criterion${type}Entry${index}Value`}
                                                style={{ flex: 2 }}
                                                mode='outlined'
                                                label={t('activityCriteriaValue')}
                                                value={activeStep.criteria && activeStep.criteria[key]}
                                                onChangeText={handleStepCriteriaValue(key)}
                                            />
                                        </View>
                                    ))}
                                </View>
                                <View>
                                    <Tooltip title={t('activityCardStepRemove')}>
                                        <IconButton
                                            icon='trash-can-outline'
                                            disabled={addedSteps <= 1}
                                            animated
                                            onPress={handleStepRemove}
                                        />
                                    </Tooltip>
                                </View>
                            </View>
                        }
                    </View>
                    <View style={styles.buttonWrapper}>
                        <Button mode='contained' style={styles.button} uppercase
                            icon={isCreating ? undefined : 'check'}
                            disabled={isCreating || nameError || stepError}
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

export default memo(ModifyActivity);

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
