import * as Crypto from 'expo-crypto';
import { memo, useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';
import { Button, Card, HelperText, IconButton, SegmentedButtons, SegmentedButtonsProps, Text, TextInput, Tooltip } from 'react-native-paper';
import { Activity, ActivityCreate, ActivityStep, useCreateActivityMutation, useUpdateActivityMutation } from '../../state/redux/api/wildEventsApi';
import HeaderActionButton from '../ui/HeaderActionButton';
import ResponsiveCardWrapper from '../ui/ResponsiveCardWrapper';
import AutoCompleteINatTaxa from '../ui/AutoCompleteINatTaxa';

// TODO: Get these values from the BE via an endpoint
const MAX_STEPS = 5;
const ADD_STEP = 'addStep';

type Props = {
    eventId: string;
    activity?: Activity;
}

function ModifyActivity({ eventId, activity }: Readonly<Props>) {
    // Translation
    const { t } = useTranslation();
    // State
    const [modalVisible, setModalVisible] = useState(false);
    const [name, setName] = useState('');
    const [description, setDescription] = useState<string | undefined>('');
    const [type, setType] = useState<ActivityCreate['type']>('RACE');
    const [step, setStep] = useState('1');
    const [addedSteps, setAddedSteps] = useState(1);
    const [steps, setSteps] = useState<ActivityCreate['steps']>([{
        id: '',
        description: '',
        criteria: { 'taxon_name': '' }
    }]);
    useEffect(() => {
        if (activity) {
            setName(activity.name);
            setDescription(activity.description);
            setType(activity.type);
            setStep('1');
            setAddedSteps(activity.steps?.length ?? 1);
            setSteps(activity.steps);
        }
    }, [activity]);
    // Redux
    const [doCreate, { isLoading: isCreating, isError: isErrorCreate, isSuccess: isSuccessCreate }] = useCreateActivityMutation();
    const [doUpdate, { isLoading: isUpdating, isError: isErrorUpdate, isSuccess: isSuccessUpdate }] = useUpdateActivityMutation();
    // Actions
    const hideModal = useCallback(() => {
        if (!isCreating && !isUpdating)
            setModalVisible(false);
    }, [isCreating, setModalVisible, setName, setDescription, setType, setSteps]);
    useEffect(() => {
        if (isSuccessCreate || isSuccessUpdate)
            hideModal();
        if (isSuccessCreate) {
            setName('');
            setDescription(undefined);
            setType('RACE');
            setStep('1');
            setSteps([{
                id: '',
                description: '',
                criteria: { 'taxon_name': '' }
            }]);
        }
    }, [isSuccessCreate, isSuccessUpdate, hideModal]);
    const handleShowButton = useCallback(() => setModalVisible(true), []);
    const handleTypeChange = useCallback((selectedType: string) => {
        setType(selectedType as ActivityCreate['type']);
        setStep('1');
        setAddedSteps(1);
        switch (selectedType) {
            case 'RACE':
                setSteps([{
                    id: Crypto.randomUUID(),
                    description: '',
                    criteria: { 'taxon_name': '' }
                }]);
                break;
            case 'HUNT':
                setSteps([{
                    id: Crypto.randomUUID(),
                    description: '',
                    criteria: { 'taxon_name': '', 'lat': '', 'lng': '', 'radius': '' }
                }]);
                break;
            case 'QUIZ':
                setSteps([{
                    id: Crypto.randomUUID(),
                    description: '',
                    criteria: { 'taxon_name': '' }
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
    }, []);
    const handleConfirm = useCallback(() => {
        if (eventId) {
            const activityBase = {
                eventId: eventId,
                name: name,
                description: description,
                type: type,
                steps: steps
            };
            if (activity)
                doUpdate({ activityId: activity.id, activityBase })
            else
                doCreate({ activityCreate: activityBase });
        }
    }, [doCreate, doUpdate, eventId, activity, name, description, type, steps]);
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
        let filteredText = text;
        switch (key) {
            case 'taxon_name':
                filteredText = text.replace(/\d+/g, '');
                break;
            case 'radius':
                filteredText = text.replace(/[^0-9.]/g, '');
                break;
            default:
                filteredText = text.replace(/(?!^-)[^0-9.]/g, '');
        }
        if (steps && step) {
            const stepIndex = Number(step) - 1;
            const newSteps: ActivityStep[] = [
                ...steps.slice(0, stepIndex),
                {
                    ...steps[stepIndex],
                    description: steps[stepIndex].description,
                    criteria: {
                        ...steps[stepIndex].criteria,
                        [key]: filteredText
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
    useEffect(() => { // Add a new step
        if (step === ADD_STEP) {
            setAddedSteps(addedSteps + 1);
            setStep(String(addedSteps + 1));
            switch (type) {
                case 'RACE':
                    setSteps([...steps!, {
                        id: Crypto.randomUUID(),
                        description: '',
                        criteria: { 'taxon_name': '' }
                    }]);
                    break;
                case 'HUNT':
                    setSteps([...steps!, {
                        id: Crypto.randomUUID(),
                        description: '',
                        criteria: { 'taxon_name': '', 'lat': '', 'lng': '', 'radius': '' }
                    }]);
                    break;
                case 'QUIZ':
                    setSteps([...steps!, {
                        id: Crypto.randomUUID(),
                        description: '',
                        criteria: { 'taxon_name': '' }
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
    const isDisabled = useMemo(() => isCreating || isUpdating, [isCreating, isUpdating]);
    const isDisabledType = useMemo(() => !!activity || isDisabled, [activity, isDisabled]);
    const typeOptions = useMemo<SegmentedButtonsProps['buttons']>(() => [
        { value: 'RACE', label: t('activityTypeRACE'), disabled: isDisabledType, style: { width: '15%' } },
        { value: 'HUNT', label: t('activityTypeHUNT'), disabled: isDisabledType, style: { width: '40%', minWidth: 130 } },
        { value: 'QUIZ', label: t('activityTypeQUIZ'), disabled: isDisabledType, style: { width: '15%' } },
        { value: 'EXPLORE', label: t('activityTypeEXPLORE'), disabled: isDisabledType, style: { width: '30%', minWidth: 120 } }
    ], [isDisabledType]);
    const stepOptions = useMemo<SegmentedButtonsProps['buttons']>(() => {
        const stepButtons: SegmentedButtonsProps['buttons'] = [{
            value: '1',
            label: t('activityCardStepCount', { step: 1 }),
            disabled: isDisabled
        }];
        for (let i = 2; i <= addedSteps; i++) {
            stepButtons.push({
                value: String(i),
                label: t('activityCardStepCount', { step: i }),
                disabled: isDisabled
            });
        }
        if (stepButtons.length < MAX_STEPS) {
            stepButtons.push({
                value: ADD_STEP,
                label: t('activityCardStepAdd'),
                disabled: isDisabled,
                icon: 'plus'
            });
        }
        return stepButtons;
    }, [type, addedSteps, isDisabled]);
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
            {activity
                ? (
                    <HeaderActionButton
                        textKey={activity ? t('edit') : t('activityCardCreateTitle')}
                        icon={activity ? 'pencil' : 'plus'}
                        onPress={handleShowButton}
                        busy={isDisabled}
                        mode={activity ? 'text' : 'contained-tonal'}
                    />
                )
                : (
                    <Button mode={activity ? 'text' : 'contained-tonal'} uppercase
                        icon={activity ? 'pencil' : 'plus'}
                        loading={isDisabled}
                        disabled={isDisabled}
                        onPress={handleShowButton}
                    >
                        {activity ? t('edit') : t('activityCardCreateTitle')}
                    </Button>
                )}
            <ResponsiveCardWrapper modalVisible={modalVisible} hideModal={hideModal}>
                <Card.Title title={t('activityCardCreateTitle')} titleVariant='titleLarge' />
                <Card.Content style={styles.content}>
                    <TextInput
                        mode='outlined'
                        label={t('activityCardName')}
                        disabled={isDisabled}
                        value={name}
                        onChangeText={setName}
                        left={<TextInput.Icon icon='tag' focusable={false} disabled />}
                        autoFocus
                    />
                    <TextInput
                        mode='outlined'
                        label={t('activityCardDescription')}
                        disabled={isDisabled}
                        value={description}
                        onChangeText={setDescription}
                        left={<TextInput.Icon icon='information' focusable={false} disabled />}
                        multiline
                        numberOfLines={3}
                    />
                    <SegmentedButtons
                        style={styles.segmentedButtons}
                        value={type}
                        onValueChange={handleTypeChange}
                        buttons={typeOptions}
                    />
                    <Text variant='bodyMedium' style={styles.type}>
                        {type === 'RACE' && t('activityTypeRaceDetails')}
                        {type === 'HUNT' && t('activityTypeHuntDetails')}
                        {type === 'QUIZ' && t('activityTypeQuizDetails')}
                        {type === 'EXPLORE' && t('activityTypeExploreDetails')}
                    </Text>
                    <SegmentedButtons
                        style={styles.segmentedButtons}
                        value={step}
                        onValueChange={setStep as any}
                        buttons={stepOptions}
                        density='medium'
                    />
                    <View>
                        {activeStep &&
                            <View style={styles.activityWrapper}>
                                <View style={styles.activityContent}>
                                    <TextInput
                                        key='description'
                                        style={styles.activityDescription}
                                        mode='outlined'
                                        label={t('activityCardStepDescription')}
                                        disabled={isDisabled}
                                        value={activeStep.description}
                                        onChangeText={handleStepDescription}
                                        left={<TextInput.Icon icon='information' focusable={false} disabled />}
                                        multiline
                                        numberOfLines={3}
                                    />
                                    {Object.keys(activeStep.criteria ?? {}).map((key, index) => {
                                        switch (key) {
                                            case 'taxon_name':
                                                return (
                                                    <AutoCompleteINatTaxa
                                                        key={`step${step}Criterion${type}Entry${index}`}
                                                        value={(activeStep.criteria && activeStep.criteria[key]) ?? ''}
                                                        onChange={handleStepCriteriaValue(key)}
                                                    />
                                                );
                                            default:
                                                return (
                                                    <TextInput
                                                        key={`step${step}Criterion${type}Entry${index}`}
                                                        disabled={isDisabled}
                                                        mode='outlined'
                                                        label={t(`activityCriteria_${key}`, { defaultValue: t('activityCriteria_custom') })}
                                                        placeholder={t(`activityCriteriaHelp_${key}`, { defaultValue: t('activityCriteriaHelp_custom') })}
                                                        value={activeStep.criteria && activeStep.criteria[key]}
                                                        onChangeText={handleStepCriteriaValue(key)}
                                                        keyboardType='decimal-pad'
                                                    />
                                                );
                                        }
                                    })}
                                </View>
                                <View>
                                    <Tooltip title={t('activityCardStepRemove')}>
                                        <IconButton
                                            icon='trash-can-outline'
                                            disabled={isDisabled || (addedSteps <= 1)}
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
                            disabled={isDisabled || nameError || stepError}
                            loading={isDisabled}
                            onPress={handleConfirm}
                        >
                            {t('confirm')}
                        </Button>
                        {(isErrorCreate || isErrorUpdate) &&
                            <HelperText type='error' visible={isErrorCreate || isErrorUpdate} >
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
    content: {
        gap: 15
    },
    type: {
        alignSelf: 'center'
    },
    segmentedButtons: {
        flexWrap: 'wrap'
    },
    activityWrapper: {
        flexDirection: 'row'
    },
    activityContent: {
        flex: 1,
        gap: 10
    },
    activityDescription: {
        display: 'flex',
        flex: 1
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
